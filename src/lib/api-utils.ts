/**
 * Extract data from API response considering the wrapper format
 * API responses are wrapped in { success: boolean, data: T, meta: any }
 * This function extracts the actual data regardless of the response format
 */

export function extractApiResponseData<T>(response: any): T {
  // Handle case where response is already the data (no wrapper)
  if (!response || typeof response !== 'object') {
    return response as T;
  }

  // Handle wrapped response format { success: boolean, data: T, meta: any }
  if ('success' in response && 'data' in response) {
    return response.data as T;
  }

  // Handle direct data format
  return response as T;
}

export function extractApiArrayData<T>(response: any): T[] {
  const data = extractApiResponseData<T[]>(response);
  return Array.isArray(data) ? data : [];
}