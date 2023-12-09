


// //from Alan's/lecturers' explanation and assignments  hint 03b

//  const DEFAULT_API = '/api/v1'; 
// const urlParams = new URLSearchParams(window.location.search);
// let urlAPI = urlParams.get('api') || DEFAULT_API
// if (!urlAPI) {
//   document.getElementById('instruction').style.display = 'block';
// } else {
//   // Clean up the URL in case there's a trailing slash
//   urlAPI = urlAPI.replace(/\/$/, '');
//   // Initializing  Vue app or other functionality that depends on the API URL


// Define the default API endpoint.
const DEFAULT_API = '/api/v1'; 

// Parse URL parameters to potentially override the default API endpoint.
const urlParams = new URLSearchParams(window.location.search);

// Determine the API endpoint, removing any trailing slash.
let urlAPI = (urlParams.get('api') || DEFAULT_API).replace(/\/$/, '');


// Creating a new Vue application.
Vue.createApp({
     // Data function to return the data object for this component.
    data() {
        return {
             // 'item' object holds the form data for creating new items.
            item: {
                id: 0,
                user_id: '',
                lat: null,
                lon: null,
                keywords: [],
                image: '',
                description: ''
            },
            keywordsInput:'',  // Temporary storage for keywords before they are processed.
            items: [], // Array to store items fetched from the server.

            // Boolean to control whether to show instructions, based on the presence of the 'api' URL parameter.
            showInstruction: !urlParams.has('api') || urlAPI === DEFAULT_API,
        }
    },     
    // Methods for various operations like creating, fetching, and deleting items.     
    methods:{  
            // Resets the form to its initial state.  
        clearForm(){
            console.log("Clearing form now")
            this.item.id = Math.random();
            this.item.user_id = '';
            this.item.lat = null;
            this.item.lon = null
            this.item.keywords = [];
            this.item.description = '';
            // Append a unique query parameter to bypass cache
            const randomKey1 = Math.floor(Math.random() * 1000)
            //const randomKey2 = Math.floor(Math.random() * 1000)
            //this.item.image = `https://picsum.photos/${randomKey1}/${randomKey2}`;
            this.item.image = `https://picsum.photos/${randomKey1}`;
            
        },
        // Method to create a new item by sending a POST request to the server.
        create_item() {
            // console.log("this.item")
            // Processing and setting the keywords from the user input.
            this.item.keywords = this.keywordsInput.split(',').map(keyword => keyword.trim());
            // Fetch API to send the POST request.
            fetch(`${urlAPI}/item`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(this.item),
            })
            .then(response => response.json())
            .then(json => {
             console.log('Received item from server:', json);
            //this.items.push(json); // Add the returned item to the items array.
             })
             .then(() =>  this.clearForm())
             .then(() =>  this.getItems())
             .catch(err => console.error(err));  
        },
        // Fetches items from the server and updates the 'items' array.
        getItems() {
        fetch(`${urlAPI}/items`,{
            method: "GET",
             })
            .then(response => response.json())
            .then(json => {
                console.log("Get works!!", json);
                this.items = [...json];
               })
               .catch(err => console.error(err));
        },
        // Sends a DELETE request to remove an item by its ID.
        deleteItem(id) {
            fetch(`${urlAPI}/item/${id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (response.status !== 204) {
                    return response.json();  // only parse JSON if response isn't 204
                }
            })
            .then(json => {
                if (json) {
                    console.log('Delete response:', json);
                } else {
                    console.log('Delete successful!');
                }
            })
            .then(() => this.getItems())
            .catch(err => console.error(err));
        },
    },
     // Lifecycle hook that is called after the instance is created.
    created() {
        // Initialize the form and fetch items when the component is created.
        this.clearForm()
        this.getItems();
       }
}).mount('#app'); // Mount the Vue app to the DOM element with id 'app'.


