export type ResponseBody<T> = {
  error?: boolean;
  data?: T[];
};

const fetchData = async <T>(url: string): Promise<ResponseBody<T>> => {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      return {
        error: true,
      };
    }
    const data = await res.json();

    return {
      data,
      error: false,
    };
  } catch (err) {
    console.error(err);
    return {
      error: true,
    };
  }
};

export default fetchData;
