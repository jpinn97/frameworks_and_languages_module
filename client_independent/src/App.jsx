import NewItemForm from "./NewItemForm";
//import ItemList from "./ItemList";


function App() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-center bg-blue-500 text-white font-bold p-5 rounded-full">FreeCycle</h1>
      <div className="flex justify-center items-center mt-8 mb-8">
        <div>
          <div>
            <NewItemForm />
          </div>
          {/* <div>
            <ItemList />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default App;
