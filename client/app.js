


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

const DEFAULT_API = '/api/v1'; 
const urlParams = new URLSearchParams(window.location.search);
let urlAPI = (urlParams.get('api') || DEFAULT_API).replace(/\/$/, '');


Vue.createApp({
    data() {
        return {
            item: {
                id: 0,
                user_id: '',
                lat: null,
                lon: null,
                keywords: [],
                image: '',
                description: ''
            },
            keywordsInput:'',
            items: [],
            showInstruction: !urlParams.has('api') || urlAPI === DEFAULT_API,
        }
    },      
    methods:{
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
        create_item() {
            // console.log("this.item")
            this.item.keywords = this.keywordsInput.split(',').map(keyword => keyword.trim());
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
    created() {
        this.clearForm()
        this.getItems();
       }
}).mount('#app');

// }
