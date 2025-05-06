import { 
  collection, 
  query, 
  where,
  getDocs,
  orderBy,
  limit,
  QueryDocumentSnapshot,
  DocumentData,
  Firestore
} from 'firebase/firestore';
import { db } from './firebase';

// Define the DocumentationData type for proper typing
interface DocumentationData {
  id: string;
  projectId: string;
  generatedAt: number;
  [key: string]: any; // Allow for other properties
}

// Temporary function to get documentation without requiring the composite index
// This uses client-side sorting as a workaround while the index builds
export async function getDocumentationsWithoutIndex(projectId: string): Promise<DocumentationData[]> {
  try {
    // Option 1: Skip the sorting in the query (fastest approach)
    const q = query(
      collection(db, 'documentations'),
      where('projectId', '==', projectId)
    );
    
    const querySnapshot = await getDocs(q);
    
    // Then sort the results client-side
    const docs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as DocumentationData[];
    
    // Sort by generatedAt in descending order
    return docs.sort((a, b) => 
      (b.generatedAt || 0) - (a.generatedAt || 0)
    );
    
  } catch (error) {
    console.error('Error getting documentations:', error);
    throw error;
  }
}

// Alternative function that uses a different query pattern
export async function getDocumentationsAlternative(projectId: string): Promise<DocumentationData[]> {
  try {
    // Option 2: Get documents in batches and combine them
    // This approach may work better for very large collections
    const docs: DocumentationData[] = [];
    
    // First batch (most recent 20)
    const firstBatch = query(
      collection(db, 'documentations'),
      where('projectId', '==', projectId),
      limit(20)
    );
    
    const firstSnapshot = await getDocs(firstBatch);
    
    firstSnapshot.docs.forEach(doc => {
      docs.push({
        id: doc.id,
        ...doc.data()
      } as DocumentationData);
    });
    
    // Sort by generatedAt in descending order
    return docs.sort((a, b) => 
      (b.generatedAt || 0) - (a.generatedAt || 0)
    );
    
  } catch (error) {
    console.error('Error getting documentations:', error);
    throw error;
  }
}

// Helper function to detect if indexes are available
export async function checkIfIndexesAreBuilt() {
  try {
    // Try a query that requires the index
    const testQuery = query(
      collection(db, 'documentations'),
      where('projectId', '==', 'test-project-id'),
      orderBy('generatedAt', 'desc'),
      limit(1)
    );
    
    await getDocs(testQuery);
    // If we get here, the index is ready
    return true;
  } catch (error: any) {
    // If we get an error about indexes, it's not ready yet
    if (error.message && error.message.includes('requires an index')) {
      return false;
    }
    // For any other error, we'll assume it's not an index issue
    return true;
  }
} 