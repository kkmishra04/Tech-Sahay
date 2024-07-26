import React, { useState } from 'react';
import axios from 'axios';
import './CSSFile/dform.css';

function DonorForm() {
    const [deliveryMethod, setDeliveryMethod] = useState('Pickup');

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            donorId: localStorage.getItem('userId'), // Assuming you're handling donorId elsewhere or via session
            gadgetName: formData.gadgetName,
            gadgetType: formData.gadgetType,
            imeiNo: formData.imeiNo,
            description: formData.description
        };

        try {
            axios.post('https://techsahay-backend.onrender.com/donate', data)
            .then(response => {
            console.log('Server Response:', response.data);
            alert('Thank you for your donation!');
            window.location.href='/dprofile'
            })
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit the form. Please try again.');
        }
    };

    // const handleDeliveryMethodChange = (event) => {
    //     setDeliveryMethod(event.target.value);
    // };

    const [formData, setFormData] = useState({
        gadgetname: '',
        gadgetType: '',
        imeiNo: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };



    return (
        <React.Fragment>
            <div className='bg-blue-50 text-gray-800'>
                <div className="container mx-auto mt-10 p-5">
                    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-bold text-center mb-6 text-purple-700">Gadget Donation Form</h1>
                        <p className="text-md text-gray-600 text-center mb-10">
                            Your donation can make a difference. Please provide details about the gadget you're donating.
                        </p>
                        <form id="donationForm" onSubmit={handleSubmit} encType="multipart/form-data">
                            {/* Form fields remain unchanged */}
                            {/* Gadget Name */}
                            <div className="mb-6">
                                <label htmlFor="gadgetName" className="block text-gray-700 text-sm font-bold mb-2">Gadget Name:</label>
                                <input type="text" id="gadgetName" onChange={handleChange} name="gadgetName" required className="form-input shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight" />
                            </div>
                            {/* Gadget Type */}
                            <div className="mb-6">
                                <label htmlFor="gadgetType" className="block text-gray-700 text-sm font-bold mb-2">Gadget Type:</label>
                                <select id="gadgetType" name="gadgetType" onChange={handleChange} required className="form-input shadow border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight">
                                    <option value>Select Type</option>
                                    <option value="Smartphone">Smartphone</option>
                                    <option value="Laptop">Laptop</option>
                                    <option value="Tablet">Tablet</option>
                                    <option value="Headphones">Headphones</option>
                                </select>
                            </div>
                            {/* IMEI Number */}
                            <div className="mb-6">
                                <label htmlFor="imeiNo" className="block text-gray-700 text-sm font-bold mb-2">IMEI Number:</label>
                                <input type="text" id="imeiNo" name="imeiNo" onChange={handleChange} required className="form-input shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight" />
                            </div>
                            {/* Description */}
                            <div className="mb-6">
                                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Fault/Description:</label>
                                <input type="text" id="description" onChange={handleChange} name="description" required className="form-input shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight" />
                            </div>
                            {/* Product Image */}
                            {/* <div className="mb-8">
                                <label htmlFor="productImage" className="block text-gray-700 text-sm font-bold mb-2">Attach Image:</label>
                                <input type="file" id="productImage" name="productImage" accept="image/*" required className="form-input shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight" />
                            </div>*/}
                            {/* Delivery Method */}
                            <div className="mb-6">
                                <h3 className="block text-gray-700 text-sm font-bold mb-2">Delivery Method:</h3>
                                <p id="dropOffAddress" className="mb-6 text-gray-700 text-sm">
                                    <strong>Drop-off Location:</strong><br />
                                    TECHSAHAY Drop-off Center, 123 Tech Street, Innovation City, 45678
                                </p>
                            </div>
                            {/* Submit Button */}
                            <div className="flex items-center justify-center">
                                <button type="submit" className="btn bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none shadow-lg transition duration-150 ease-in-out transform">Submit Donation</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default DonorForm;
