import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSSFile/Recipienthome.css';
import logo from './Pictures/TECH_SAHAY.png';

function Recipienthome() {
    const [devices, setDevices] = useState([]);
    const [activeFilter, setActiveFilter] = useState('All');

    const filters = ['All', 'Smartphone', 'Laptop', 'Tablet', 'Headphones'];

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await axios.get('https://techsahay-backend.onrender.com/gadgetlist');
                setDevices(response.data);
            } catch (error) {
                console.error('Error fetching devices:', error);
            }
        };

        fetchDevices();
    }, []);

    const displayDevices = (filter = 'All') => {
        return devices.filter(device => filter === 'All' || device.gadgetype === filter);
    };

    const selectDevice = async (deviceId) => {
        try {
            const recipientId = localStorage.getItem('userId'); // Assuming you have a way to get this (from user session, etc.)
            const response = await axios.post('https://techsahay-backend.onrender.com/receive-gadget', {
                id: deviceId,
                recipientId: recipientId
            });
            console.log(response.data.message);
            // Update local state to reflect changes or refresh data
            setDevices(prevDevices => prevDevices.filter(device => device.id !== deviceId));
        } catch (error) {
            console.error('Error receiving device:', error);
            // Optionally handle the error in UI
        }
    };

    const redirectToProfile = () => {
        console.log("Redirecting to Recipient Profile...");
        window.location.href='/rprofile';
    };

    return (
        <React.Fragment>
            <div className="App bg-gray-50">
                <nav className="bg-blue-600 p-5 text-white font-semibold text-lg">
                    <div className="container mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <img src={logo} alt="TECHSAHAY logo" className="w-16" />
                            <div className="text-lg font-bold">TECHSAHAY</div>
                        </div>
                        <button onClick={redirectToProfile} className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition duration-300 ease-in-out transform hover:-translate-y-1">
                            Profile
                        </button>
                    </div>
                </nav>

                <section className="container mx-auto p-6">
                    <div id="filterSection" className="flex flex-wrap gap-2 justify-center mb-8">
                        {filters.map((filter, index) => (
                            <button key={index}
                                className={`filter-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out ${activeFilter === filter ? 'active' : ''}`}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <div id="devicesList" className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {displayDevices(activeFilter).map((device) => (
                            <div key={device.id} className="device-card bg-white shadow rounded-lg p-4 flex flex-col items-center">
                                <div className="p-2 text-center">
                                    <h5 className="text-lg font-semibold">{device.gadgetname}</h5>
                                    <p className="text-gray-900">{device.description}</p>
                                    <p className="text-sm text-gray-800 mb-2">Device ID :{device.id}</p>
                                    <p className="text-sm text-gray-500 mb-4">{device.gadgetype}</p>
                                    <button onClick={() => selectDevice(device.id)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                                        Receive It
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </React.Fragment>
    );
}

export default Recipienthome;
