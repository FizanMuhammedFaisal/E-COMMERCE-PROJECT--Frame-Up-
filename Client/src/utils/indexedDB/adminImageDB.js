import { openDB } from 'idb'

const DB_NAME = 'adminImageStore'
const DB_VERSION = 1
const OBJECT_STORE_NAME = 'images'

// Initialize the database
export const initDB = async () => {
  try {
    return openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore(OBJECT_STORE_NAME)
      }
    })
  } catch (error) {
    console.error('Error initializing IndexedDB:', error)
    throw new Error('Error initializing IndexedDB')
  }
}

// Add a single image to the database and return the id
export const addImageToDB = async file => {
  try {
    const db = await initDB() // Open the database
    const transaction = db.transaction(OBJECT_STORE_NAME, 'readwrite')
    const store = transaction.objectStore(OBJECT_STORE_NAME)

    // Generate a unique id for the file
    const id = `${Date.now()}-${file.name}`

    store.put(file, id)
    await transaction.done // Wait for the transaction to complete

    return id
  } catch (error) {
    console.error('Error adding image to IndexedDB:', error)
    throw new Error('Error adding image to IndexedDB')
  }
}

// Add multiple images to the database
export const addImagesToDB = async files => {
  try {
    const db = await initDB() // Open the database
    const transaction = db.transaction(OBJECT_STORE_NAME, 'readwrite')
    const store = transaction.objectStore(OBJECT_STORE_NAME)

    const ids = []

    // Add each file to the store
    for (const file of files) {
      const id = `${Date.now()}-${file.name}`
      store.put(file, id)
      ids.push(id) // Collect the id
    }

    await transaction.done // Wait for the transaction to complete

    return ids // Return the array of unique ids
  } catch (error) {
    console.error('Error adding multiple images to IndexedDB:', error)
    throw new Error('Error adding multiple images to IndexedDB')
  }
}

// Get an image from the database by its id
export const getImageFromDB = async id => {
  try {
    const db = await initDB() // Open the database
    const transaction = db.transaction(OBJECT_STORE_NAME, 'readonly')
    const store = transaction.objectStore(OBJECT_STORE_NAME)
    const image = await store.get(id) // Get the image by its id
    await transaction.done // Wait for the transaction to complete
    return image // Return the image file
  } catch (error) {
    console.error('Error retrieving image from IndexedDB:', error)
    throw new Error('Error retrieving image from IndexedDB')
  }
}
export const clearAllFilesInDB = async () => {
  try {
    const db = await initDB() // Open the database
    const transaction = db.transaction(OBJECT_STORE_NAME, 'readwrite')
    const store = transaction.objectStore(OBJECT_STORE_NAME)

    // Clear the entire object store
    store.clear()

    // Wait for the transaction to complete
    await transaction.done

    console.log('All files have been successfully deleted from IndexedDB.')
  } catch (error) {
    console.error('Error clearing IndexedDB:', error)
  }
}
