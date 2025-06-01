import fs from "fs" // Работа с файловой системой (чтение/запись файлов, работа с директориями)
import path from "path" // Модуль для работы с путями файлов и директорий
import { Plugin } from "vite" // Импорт типа `Plugin` из Vite (для создания Vite-плагинов)
import matter from "gray-matter" // Библиотека для работы с фронтматтером (метаданные в `.mdx` файлах)
import yaml from "js-yaml"

const DOCS_DIR = path.resolve(process.cwd(), "docs")
const OUTPUT_FILE = path.resolve(process.cwd(), "src/sidebar.json")

interface SidebarItem {
  title: string;
  path?: string;
  num: number;
  children?: SidebarItem[];
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * The function searches and reads metadata from `.yaml` files in directories
 */
function readMetaDirectory(dir: string): Record<string, any> {
  const metaPath = path.join(dir, ".yaml")

  if (fs.existsSync(metaPath)) { // Проверяем, существует ли файл
    try {
      const content = fs.readFileSync(metaPath, { encoding: "utf-8" })
      return yaml.load(content) as Record<string, any>
    } catch (err) {
      console.error(`❌ Error when reading .yaml in ${dir}: `, err)
    }
  }

  return {}
}

function getUniqueNum(desired: number, usedNums: Set<number>): number {
  while (usedNums.has(desired)) {
    desired++
  }
  usedNums.add(desired)

  return desired
}

/**
 * Collects unique values of `order` from .yaml and .md/.mdx files to the SET collection <br>
 * Returns an error and stops code execution if there are duplicate values
 */
function collectNums (entries: fs.Dirent[], dir: string): Set<number> {
  const usedNums = new Set<number>()

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      const metaData = readMetaDirectory(fullPath)
      const order = metaData["order"]

      if (order) {
        if (usedNums.has(order)) {
          throw new Error(`❌  Duplicate order '${order}' in .yaml file: ${fullPath}`)
        }
        usedNums.add(order)
      }
    }

    if (entry.isFile() && (entry.name.endsWith(".mdx") || entry.name.endsWith(".md"))) {
      const fileContent = fs.readFileSync(fullPath, { encoding: "utf-8" })
      const { data } = matter(fileContent)
      const order = data["order"]

      if (order) {
        if (usedNums.has(order)) {
          throw new Error(`❌  Duplicate order '${order}' in file: ${fullPath}`)
        }
        usedNums.add(order)
      }
    }
  }

  return usedNums
}

/**
 * Recursively creates structure of the sidebar from files and folders inside specified directory
 *
 * - Iterates through all entries (files and folders) in the given `dir`.
 * - If an entry is a directory, reads its metadata and recursively processes its contents.
 * - If an entry is a Markdown file (`.md` or `.mdx`), extracts metadata using `gray-matter`
 *   and constructs an object to be displayed in the sidebar.
 * - Assigns unique `num` values for sorting, based on the `order` field from .yaml file in the directory's
 *   or the `order` from the metadata of the md/mdx file.
 * - Returns an array of `SidebarItem[]`, sorted by `num` at each nesting level.
 *
 * @param dir - Absolute path to the directory
 * @param base - Relative path from the project root (used to generate URLs)
 * @returns An array of `SidebarItem` objects representing the navigation structure
 */
function createJSON(dir: string, base = ""): SidebarItem[] {
  // Reads the contents of the directory `dir` and returns an array of data
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const usedNums = collectNums(entries, dir)

  return entries.map((entry, index) => {
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.join(base, entry.name) // path inside docs
    const fileName = path.parse(entry.name).name // file name without extension

    // const isRootFile = base === "" && fileName === "index"

    if (entry.isDirectory()) { // if element is a directory
      const metaData = readMetaDirectory(fullPath)
      const uniqNum = getUniqueNum(index, usedNums)

      return {
        title: capitalize(entry.name),
        num: metaData["order"] || uniqNum,
        children: createJSON(fullPath, relativePath), // recursive call for nested files/folders
      }
    }

    if (entry.isFile() && (entry.name.endsWith(".mdx") || entry.name.endsWith(".md"))) {
      const fileContent = fs.readFileSync(fullPath, { encoding: "utf-8" })
      const { data } = matter(fileContent) // extract metadata from file
      const uniqNum = getUniqueNum(index, usedNums)

      // if (isRootFile) {
      //   return {
      //     title: capitalize(data["sidebar-title"] || "Getting started"),
      //     element: capitalize(fileName),
      //     path: "/",
      //   }
      // }

      return {
        title: capitalize(data["sidebar-title"] || fileName), // title from metadata in priority
        num: data["order"] || uniqNum,
        path: `/${relativePath.replace(/\\/g, "/").replace(/\.(mdx|md)$/, "")}`,
      }
    }

    return null
  })
  .filter(Boolean) // filter null values (if in .map() anything return null)
  .map((item) => { // sorting for nested array (2 lvl)
    if (item?.children) {
      return {
        ...item,
        children: item?.children.sort((a, b) => (a?.num ?? 0) - (b?.num ?? 0))
      }
    }
    return item
  })
  .sort((a, b) => (a?.num ?? 0) - (b?.num ?? 0)) as SidebarItem[] // sorting for 1 lvl
}

function generator() {
  const sidebarStructure: SidebarItem[] = createJSON(DOCS_DIR)
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sidebarStructure, null, 2))
  console.log("✅  Sidebar JSON updated")
}

export default function generateSidebarJson(): Plugin {
  return {
    name: "generate-sidebar-json",
    buildStart() {
      generator()
    },
    configureServer(server) {
      // Here is a JSON automatic update during changes in DOCS
      fs.watch(DOCS_DIR, { recursive: true }, () => {
        generator()
        server.ws.send({
          type: "full-reload",
        })
      })
    },
  }
}
