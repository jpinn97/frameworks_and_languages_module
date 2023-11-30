import NewItemForm from "./NewItemForm"
import Heading  from "./Heading";



function App() {
  return (
    <div className="container mx-auto">
      < Heading />
      <div className="flex justify-center items-center mt-8 mb-8">  
            < NewItemForm />     
      </div>
    </div>
  );
}

export default App;
