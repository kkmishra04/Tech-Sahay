import React, { useState, useEffect } from 'react';
import './CSSFile/Donated.css';
import axios from 'axios';

function Donated() {
    const [gadgets, setGadgets] = useState([]);
    const donorId = localStorage.getItem('userId'); // This should come from some state or prop

    useEffect(() => {
        const fetchGadgets = async () => {
            try {
                const response = await axios.get(`https://techsahay-backend.onrender.com/api/gadgets/${donorId}`);
                console.log(response.data); // Check what the response is
                setGadgets(response.data);
            } catch (error) {
                console.error('Failed to fetch gadgets:', error);
            }
        };

        fetchGadgets();
    }, [donorId]);

    const cancelDonation = async (gadget) => {
        if (window.confirm('Are you sure you want to cancel this donation?')) {
            try {
                await axios.delete(`https://techsahay-backend.onrender.com/cancel-received/${gadget.id}`);
                setGadgets(gadgets.filter(g => g.id !== gadget.id));
                alert('Donation cancelled successfully.');
            } catch (error) {
                alert('Failed to cancel donation');
                console.error('Error cancelling donation:', error);
            }
        }
    };

    return (
        <div className='bg-gray-100'>
            <div className="mx-auto px-4 py-8 max-w-7xl">
                <h1 className='text-3xl font-semibold text-center mb-12 text-purple-700'>Gadgets Available</h1>
                <div className="flex flex-wrap justify-center">
                    {gadgets.map((gadget, index) => (
                        <div key={index} className="p-4 md:w-1/3 lg:w-1/4 card">
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="p-6">
                                    <h3 className="text-xl font-bold">{gadget.gadgetname}</h3>
                                    <p className="text-md">Type: {gadget.gadgetype}</p>
                                    <p className="text-md">Condition: {gadget.description}</p>
                                    <p className='text-md'>Gadget ID : {gadget.id}</p>
                                    {gadget.source === 'received' && (
                                        <button onClick={() => cancelDonation(gadget)} className="mt-2 px-4 py-2 bg-red-500 text-white rounded cursor-pointer">
                                            Cancel Donation
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

export default Donated;
