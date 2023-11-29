import NewItemForm from "./NewItemForm";
import Heading  from "./Heading";



function App() {
  return (
    <div className="container mx-auto">
      {/* <h1 className="text-center bg-gray-700 text-white font-bold p-5 ">FreeCycle</h1> */}
      < Heading />
      <div className="flex justify-center items-center mt-8 mb-8">  
            < NewItemForm />     
      </div>
    </div>
  );
}

export default App;
