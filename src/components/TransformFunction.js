/*
async function TransformFunction(file) {
        // Function will return a new Promise which will resolve or reject based on whether the JSON file is read and parsed successfully
        return new Promise((resolve, reject) => {
            // Define a FileReader Object to read the file
            let fileReader = new FileReader();
            // Specify what the FileReader should do on the successful read of a file
            fileReader.onload = event => {
                // If successfully read, resolve the Promise with JSON parsed contents of the file
                resolve(JSON.parse(event.target.result))
            };
            // If the file is not successfully read, reject with the error
            fileReader.onerror = error => reject(error);
            // Read from the file, which will kick-off the onload or onerror events defined above based on the outcome
            fileReader.readAsText(file);
        });
}
*/



//export default TransformFunction;
