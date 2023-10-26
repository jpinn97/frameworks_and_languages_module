import apiService from "../api_service.ts";

interface QueryItemsFormProps {
  getItems: () => Promise<void>;
}

function QueryItemsForm({ getItems }: QueryItemsFormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const queryString = new URLSearchParams(formData as never).toString();
    try {
      const queryData = await apiService.queryItems(queryString);
      console.log(queryData);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        User ID:
        <input type="text" name="query_user_id" />
      </label>
      <br />
      <label>
        Description:
        <textarea name="query_description" />
      </label>
      <br />
      <label>
        Keywords:
        <textarea name="query_keywords" />
      </label>
      <br />
      <label>
        Image:
        <input type="text" name="query_image" />
      </label>
      <br />
      <label>
        Latitude:
        <input type="number" name="query_lat" />
      </label>
      <br />
      <label>
        Longitude:
        <input type="number" name="query_lon" />
      </label>
      <br />
      <label>
        Date From:
        <input type="datetime-local" name="query_date_from" />
      </label>
      <br />
      <label>
        Date To:
        <input type="datetime-local" name="query_date_to" />
      </label>
      <br />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        type="submit"
      >
        Search
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        type="button"
        onClick={getItems}
      >
        Refresh
      </button>
    </form>
  );
}

export default QueryItemsForm;
