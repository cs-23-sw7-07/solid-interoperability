import axios, { AxiosError } from 'axios';

const url = 'http://localhost:3000/';
const maxRetries = 60;
const retryDelay = 1000; // 1000 milliseconds (1 second)

async function makeRequest(retry: number = 0): Promise<void> {
  try {
    const response = await axios.get(url, { timeout: 1000 });

    if (response.status === 200) {
      console.log('Request successful!');
    } else {
      handleRetry(retry);
    }
  } catch (error) {
    handleRetry(retry, error as AxiosError);
  }
}

function handleRetry(retry: number, error?: AxiosError): void {
  if (retry < maxRetries) {
    console.error(`Retry ${retry + 1}/${maxRetries}. Retrying after ${retryDelay / 1000} seconds.`);

    setTimeout(() => {
      makeRequest(retry + 1);
    }, retryDelay);
  } else {
    console.error('Max retries reached. Request failed.');
    if (error) {
      console.error('Error details:', error.message);
    }
    process.exit(1);
  }
}

makeRequest();
