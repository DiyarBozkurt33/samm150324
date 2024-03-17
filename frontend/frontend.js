document.addEventListener('DOMContentLoaded', function () {
    const savePointButton = document.getElementById('save-point-btn');
    const downloadButton = document.getElementById('download-btn');
    const deleteButton = document.getElementById('delete-btn');
    const savedPointsList = document.getElementById('saved-points-list');



    document.getElementById('saveButton').addEventListener('click', function() {
        const data = { message: 'Hello, world!' };
        
        fetch('/saveData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Data saved successfully');
        })
        .catch(error => {
            console.error('Error saving data:', error);
        });
    });
    

    async function fetchSavedPoints() {
        try {
            const response = await fetch('http://localhost:3001/points');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching points:', error);
            return [];
        }
    }

    async function displaySavedPoints() {
        savedPointsList.innerHTML = '';
        const points = await fetchSavedPoints();
        points.forEach(point => {
            const listItem = document.createElement('li');
            listItem.textContent = `Lat: ${point.lat}, Lng: ${point.lng}, Date: ${new Date(point.datetime).toLocaleString()}`;
            listItem.dataset.id = point.id;
            listItem.addEventListener('click', function () {
                const selectedPointId = parseInt(this.dataset.id); 
                const selectedPoint = points.find(point => point.id === selectedPointId);
            });
            savedPointsList.appendChild(listItem);
        });
    }


    savePointButton.addEventListener('click', async function () {
        const center = map.getCenter();
        const coordinates = {
            lat: center.lat,
            lng: center.lng
        };
        try {
            const response = await fetch('http://localhost:3001/save-point', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(coordinates)
            });
            if (response.ok) {
                console.log('Point saved.');
                // Refresh the list of saved points
                displaySavedPoints();
            } else {
                console.error('Failed to save point.');
            }
        } catch (error) {
            console.error('Error saving point:', error);
        }
    });

    downloadButton.addEventListener('click', async function () {
        try {
            // fetch saved points
            const points = await fetchSavedPoints();
            // convert points
            const jsonData = JSON.stringify(points, null, 2);
            // download
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'saved_points.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading points:', error);
        }
    });

    deleteButton.addEventListener('click', async function () {
        try {
            // Send a request to the backend to delete the selected point
            const selectedPointId = parseInt(this.dataset.id);
            const response = await fetch("http://localhost:3001/delete-point/${selectedPointId}", {
            method: 'DELETE'
            });
            if (response.ok) {
                console.log('Point deleted successfully.');
                // Refresh the list of saved points
                displaySavedPoints();
            } else {
                console.error('Failed to delete point.');
            }
        } catch (error) {
            console.error('Error deleting point:', error);
        }
    });

    displaySavedPoints();
});
