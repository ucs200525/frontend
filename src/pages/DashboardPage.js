import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = ({ uid }) => {
  const [patient, setPatient] = useState(null);
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    const fetchPatientData = async () => {
      if (uid) {
        try {
          const response = await axios.get(`https://ecs-backend-xsuv.onrender.com/api/patients/${uid}`);
          setPatient(response.data);
          setUpdatedData({
            ...response.data,
            otherFields: response.data.otherFields || { address: '', email: '', phone: '' },
          });
        } catch (error) {
          console.error('Error fetching patient:', error.response ? error.response.data : error.message);
        }
      }
    };

    fetchPatientData();
  }, [uid]);

  // Handle updates, including for nested fields
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('otherFields')) {
      const fieldName = name.split('[')[1].slice(0, -1); // e.g., 'address', 'email', 'phone'
      setUpdatedData((prevData) => ({
        ...prevData,
        otherFields: {
          ...prevData.otherFields,
          [fieldName]: value,
        },
      }));
    } else {
      setUpdatedData({ ...updatedData, [name]: value });
    }
  };

  const handleUpdateSubmit = async (field) => {
    try {
      let dataToSend;

      if (field.startsWith('otherFields.')) {
        const nestedField = field.split('.')[1];

        dataToSend = {
          otherFields: {
            ...updatedData.otherFields,
            [nestedField]: updatedData.otherFields[nestedField],
          },
        };
      } else {
        dataToSend = { [field]: updatedData[field] };
      }

      const response = await axios.put(`https://ecs-backend-xsuv.onrender.com/api/patients/${uid}`, dataToSend);
      if (response.status === 200) {
        alert("Updated Successfully");
      } else {
        Promise.reject();
      }

      console.log('Patient updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating patient:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className='dashboard-container'>
      <div className='dashboard'>
        <h2>Patient Dashboard</h2>
        {patient && (
          <table>
            <tbody>
              <tr>
                <td>NAME:</td>
                <td>
                  <input type="text" name="name" value={updatedData.name || ''} onChange={handleUpdateChange} />
                </td>
                <td><button onClick={() => handleUpdateSubmit('name')}>UPDATE</button></td>
              </tr>
              <tr>
                <td>AGE:</td>
                <td>
                  <input type="number" name="age" value={updatedData.age || ''} onChange={handleUpdateChange} />
                </td>
                <td><button onClick={() => handleUpdateSubmit('age')}>UPDATE</button></td>
              </tr>
              <tr>
                <td>GENDER:</td>
                <td>
                  <select name="gender" value={updatedData.gender || ''} onChange={handleUpdateChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </td>
                <td><button onClick={() => handleUpdateSubmit('gender')}>UPDATE</button></td>
              </tr>
              <tr>
                <td>ADDRESS:</td>
                <td>
                  <input
                    type="text"
                    name="otherFields[address]"
                    value={updatedData.otherFields?.address || ''}
                    onChange={handleUpdateChange}
                  />
                </td>
                <td><button onClick={() => handleUpdateSubmit('otherFields.address')}>UPDATE</button></td>
              </tr>
              <tr>
                <td>EMAIL:</td>
                <td>
                  <input
                    type="text"
                    name="otherFields[email]"
                    value={updatedData.otherFields?.email || ''}
                    onChange={handleUpdateChange}
                  />
                </td>
                <td><button onClick={() => handleUpdateSubmit('otherFields.email')}>UPDATE</button></td>
              </tr>
              <tr>
                <td>PHONE:</td>
                <td>
                  <input
                    type="text"
                    name="otherFields[phone]"
                    value={updatedData.otherFields?.phone || ''}
                    onChange={handleUpdateChange}
                  />
                </td>
                <td><button onClick={() => handleUpdateSubmit('otherFields.phone')}>UPDATE</button></td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
  
};

export default Dashboard;
