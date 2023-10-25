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
        <input type="text" name="user_id" />
      </label>
      <br />
      <label>
        Description:
        <textarea name="description" />
      </label>
      <br />
      <label>
        Keywords:
        <textarea name="keywords" />
      </label>
      <br />
      <label>
        Image:
        <input type="text" name="image" />
      </label>
      <br />
      <label>
        Latitude:
        <input type="number" name="lat" />
      </label>
      <br />
      <label>
        Longitude:
        <input type="number" name="lon" />
      </label>
      <br />
      <label>
        Date From:
        <input type="datetime-local" name="date_from" />
      </label>
      <br />
      <label>
        Date To:
        <input type="datetime-local" name="date_to" />
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
