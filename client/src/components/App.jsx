// Import the NewItemForm and Heading components from their respective files.

import NewItemForm from "./NewItemForm"
import NewItemForm from "./NewItemForm"
import Heading  from "./Heading";


// Define the App component.
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


// Export the App component for use in other parts of the application Eg. main.jsx

export default App;
