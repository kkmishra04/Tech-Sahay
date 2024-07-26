import React, { useState } from 'react';
import axios from 'axios';
import './CSSFile/dlist.css'

function Dlist() {
    const [currentData, setCurrentData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [dataSource, setDataSource] = useState('');  // 'receiving' or 'giving'
    const fetchReceivingData = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.get('https://techsahay-backend.onrender.com/data/receiving');
            setCurrentData(response.data);
            setDataSource('receiving');
        } catch (error) {
            console.error('Failed to fetch receiving data:', error);
            setError('Failed to load receiving data. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchGivingData = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.get('https://techsahay-backend.onrender.com/data/giving');
            setCurrentData(response.data);
            setDataSource('giving');
        } catch (error) {
            console.error('Failed to fetch giving data:', error);
            setError('Failed to load giving data. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredData = currentData.filter(gadget =>
        gadget.id.toString().includes(searchTerm)
    );

    const handleCancel = async (gadget) => {
        try {
            if (dataSource === 'receiving') {
                // Call backend to remove from receiving table
                await axios.delete(`https://techsahay-backend.onrender.com/cancel-received/${gadget.id}`);
                // Optionally, update the UI immediately
                setCurrentData(currentData.filter(item => item.id !== gadget.id));
            } else if (dataSource === 'giving') {
                // Call backend to remove from giving table and add back to gadget table
                await axios.delete(`https://techsahay-backend.onrender.com/cancel-donation/${gadget.id}`);
                setCurrentData(currentData.filter(item => item.id !== gadget.id));
            }
        }  catch (error) {
            console.error('Error handling cancel:', error);
            let errorMessage = 'No error message available'; // Default message
            if (error.response && error.response.data && error.response.data.message) {
                // Server responded with a structured error message
                errorMessage = error.response.data.message;
            } else if (error.message) {
                // Error in making the request
                errorMessage = error.message;
            }
            setError(`Error processing your request: ${errorMessage}`);
        }
    };


    const handleConfirm = async (gadget) => {
        try {
            const endpoint = dataSource === 'receiving' ? '/confirm-receive' : '/confirm-give';
            await axios.post(`https://techsahay-backend.onrender.com${endpoint}`, { id: gadget.id });
            setCurrentData(currentData.filter(item => item.id !== gadget.id));
        } catch (error) {
            console.error('Error handling confirm:', error);
            setError('Error processing your request. Please try again.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-5">
            <div className="text-center mb-6">
                <h1 className="font-bold text-2xl">Gadget Management Dashboard</h1>
            </div>
            <div className="mb-4 flex justify-between">
                <button onClick={fetchReceivingData} className="btn bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Receiving</button>
                <button onClick={fetchGivingData} className="btn bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">Giving</button>
            </div>
            <div className="mb-4">
                <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Search by Gadget ID..." className="p-2 w-full border rounded" />
            </div>
            {isLoading ? <p>Loading...</p> : error ? <p>{error}</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredData.map(gadget => (
                        <div key={gadget.id} className="bg-blue-200 p-4 rounded shadow flex flex-col items-center text-center">
                            <h3 className="font-bold">{gadget.name}</h3>
                            <p>Type: {gadget.gadgetype}</p>
                            <p>ID: {gadget.id}</p>
                            <div className="overflow-auto max-h-24 overflow-y-auto w-full p-1 hide-scrollbar">
                                <p>Description: {gadget.description}</p>
                            </div>
                            <button className="bg-red-500 text-white px-3 mt-3 mb-3 py-1 rounded hover:bg-red-700 transition duration-200" onClick={() => handleCancel(gadget)}>Cancel</button>
                            <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700 transition duration-200" onClick={() => handleConfirm(gadget)}>Confirm</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dlist;
