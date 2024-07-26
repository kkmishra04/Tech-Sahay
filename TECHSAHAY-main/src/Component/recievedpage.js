import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './Pictures/TECH_SAHAY.png';  // Ensure the path is correct
import './CSSFile/recievedpage.css'

function ReceivedPage() {
    const [gadgets, setGadgets] = useState([]);

    const recipientId = localStorage.getItem('userId');  // Assumes userID is stored in localStorage

    useEffect(() => {
        const fetchGadgets = async () => {
            try {
                const [donatedResponse, historyResponse] = await Promise.all([
                    axios.get(`https://techsahay-backend.onrender.com/api/gadgets/donated/${recipientId}`),
                    axios.get(`https://techsahay-backend.onrender.com/api/gadgets/receivedhistory/${recipientId}`)
                ]);
                const donatedGadgets = donatedResponse.data.map(gadget => ({ ...gadget, canCancel: true }));
                const historyGadgets = historyResponse.data.map(gadget => ({ ...gadget, canCancel: false }));
                setGadgets([...donatedGadgets, ...historyGadgets]);
            } catch (error) {
                console.error('Error fetching gadgets:', error);
            }
        };

        fetchGadgets();
    }, [recipientId]);

    const cancelRequest = async (id) => {
        try {
            await axios.delete(`https://techsahay-backend.onrender.com/cancel-donation/${id}`);
            const updatedGadgets = gadgets.filter(gadget => gadget.id !== id);
            setGadgets(updatedGadgets);
            alert('Request cancelled successfully.');
        } catch (error) {
            alert('Failed to cancel the request');
            console.error('Error cancelling the request:', error);
        }
    };

    return (
        <div className="bg-gray-100">
            <nav className="bg-blue-600 p-5 text-white font-semibold text-lg">
                <div className="container mx-auto flex justify-between items-center flex-wrap">
                    <a href="/rhome" className="flex items-center gap-4">
                        <img src={logo} alt="TECHSAHAY Logo" className="w-16" />
                        <div>TECHSAHAY</div>
                    </a>
                    <button onClick={() => { window.location.href = '/rprofile'; }} className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded">
                        Profile
                    </button>
                </div>
            </nav>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-semibold text-center mb-12">Your Gadgets</h1>
                <div className="flex flex-wrap justify-center">
                    {gadgets.map((gadget, index) => (
                        <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 card">
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="p-6">
                                    <h3 className="text-lg font-bold">{gadget.gadgetname}</h3>
                                    <p>Type: {gadget.gadgetype}</p>
                                    <p>Condition: {gadget.description}</p>
                                    <p>Gadget ID : {gadget.id}</p>
                                    {gadget.canCancel && (
                                        <button onClick={() => cancelRequest(gadget.id)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-150 ease-in-out">
                                            Cancel Request
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ReceivedPage;
