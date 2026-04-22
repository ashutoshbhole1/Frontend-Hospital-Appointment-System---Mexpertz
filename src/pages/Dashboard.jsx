import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(user.role === 'admin' ? 'directory' : 'appointments');
  const [directory, setDirectory] = useState([]);
  
  const [showBooking, setShowBooking] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  
  const [bookingData, setBookingData] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: ''
  });
  
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    time: ''
  });
  
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    if (user.role !== 'admin') {
      fetchAppointments();
    }
    if (user.role === 'user') {
      fetchDoctors();
    }
    if (user.role === 'admin') {
      fetchDirectory();
    }
  }, [user]);

  const fetchDirectory = async () => {
    try {
      const res = await axios.get('/users');
      setDirectory(res.data.data || res.data);
    } catch (err) {
      console.error('Failed to fetch directory', err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('/users/doctors');
      setDoctors(res.data.data || res.data);
    } catch (err) {
      console.error('Failed to fetch doctors', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const [res] = await Promise.all([
        axios.get(`/appointments/user/${user.id || user._id}`),
        new Promise(resolve => setTimeout(resolve, 1200)) // 1.2s delay for smoothness
      ]);
      setAppointments(res.data.data || res.data);
    } catch (err) {
      setError('Failed to fetch appointments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/appointments', {
        ...bookingData,
        patientId: user.id || user._id,
        appointmentDate: bookingData.date,
        timeSlot: bookingData.time
      });
      setShowBooking(false);
      fetchAppointments();
      setBookingData({ doctorId: '', date: '', time: '', reason: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`/appointments/${id}`, { status });
      fetchAppointments();
    } catch (err) {
      setError('Failed to update appointment status');
    }
  };

  const handleRescheduleClick = (appt) => {
    setSelectedAppt(appt);
    setRescheduleData({
      date: new Date(appt.appointmentDate || appt.date).toISOString().split('T')[0],
      time: appt.timeSlot || appt.time
    });
    setIsRescheduling(true);
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/appointments/${selectedAppt._id}`, {
        appointmentDate: rescheduleData.date,
        timeSlot: rescheduleData.time,
        status: 'pending' // Reset to pending when rescheduled
      });
      setIsRescheduling(false);
      setSelectedAppt(null);
      fetchAppointments();
    } catch (err) {
      setError('Failed to reschedule appointment');
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await axios.put(`/appointments/${id}/cancel`);
        fetchAppointments();
      } catch (err) {
        setError('Failed to cancel appointment');
      }
    }
  };

  if (loading && user.role !== 'admin') return <LoadingSpinner fullPage />;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome, {user.name}!</h2>
        <div className="header-actions">
          {user.role === 'admin' && <span className="badge admin-badge">Admin Access</span>}
          {user.role === 'doctor' && <span className="badge doctor-badge">Doctor Panel</span>}
          {user.role === 'user' && (
            <button className="btn-primary" onClick={() => setShowBooking(!showBooking)}>
              {showBooking ? 'View My Appointments' : 'Book New Appointment'}
            </button>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isRescheduling && (
        <div className="booking-card reschedule-card">
          <h3>Reschedule Appointment</h3>
          <form onSubmit={handleRescheduleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>New Date</label>
                <input type="date" value={rescheduleData.date} onChange={(e) => setRescheduleData({...rescheduleData, date: e.target.value})} required min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group">
                <label>New Time</label>
                <input type="time" value={rescheduleData.time} onChange={(e) => setRescheduleData({...rescheduleData, time: e.target.value})} required />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-submit">Confirm Reschedule</button>
              <button type="button" className="btn-cancel-flat" onClick={() => setIsRescheduling(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {showBooking && user.role === 'user' ? (
        <div className="booking-card">
          <h3>Schedule an Appointment</h3>
          <form onSubmit={handleBookSubmit}>
            <div className="form-group">
              <label>Select Doctor</label>
              <select name="doctorId" value={bookingData.doctorId} onChange={handleBookChange} required>
                <option value="">Choose a specialist...</option>
                {doctors.map(doc => (
                  <option key={doc._id} value={doc._id}>{doc.name}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input type="date" name="date" value={bookingData.date} onChange={handleBookChange} required min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input type="time" name="time" value={bookingData.time} onChange={handleBookChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Reason for Visit</label>
              <input type="text" name="reason" value={bookingData.reason} onChange={handleBookChange} required placeholder="e.g. Regular checkup" />
            </div>
            <button type="submit" className="btn-submit">Confirm Appointment</button>
          </form>
        </div>
      ) : user.role === 'admin' ? (
        <div className="directory-section">
          <h3>System Directory (Users & Doctors)</h3>
          <div className="appointments-grid">
            {directory.map(person => (
              <div key={person._id} className="appointment-card">
                <div className="appt-status">
                  <span className={`status-badge ${person.role}`}>{person.role}</span>
                </div>
                <div className="appt-details">
                  <p><strong>Name:</strong> {person.name}</p>
                  <p><strong>Email:</strong> {person.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="appointments-section">
          <h3>{user.role === 'doctor' ? 'Appointments with Patients' : 'My Appointments'}</h3>
          {appointments.length === 0 ? (
            <p className="no-data">No appointments found.</p>
          ) : (
            <div className="appointments-grid">
              {appointments.map(appt => (
                <div key={appt._id} className="appointment-card">
                  <div className="appt-status">
                    <span className={`status-badge ${appt.status}`}>{appt.status}</span>
                  </div>
                  <div className="appt-details">
                    {user.role === 'doctor' ? (
                      <p><strong>Patient:</strong> {appt.patientId?.name || 'Unknown'}</p>
                    ) : (
                      <p><strong>Doctor:</strong> {appt.doctorId?.name || 'Unknown'}</p>
                    )}
                    <p><strong>Date:</strong> {new Date(appt.appointmentDate || appt.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {appt.timeSlot || appt.time}</p>
                    <p><strong>Reason:</strong> {appt.reason}</p>
                  </div>
                  
                  <div className="appt-actions">
                    {user.role === 'doctor' && appt.status === 'pending' && (
                      <>
                        <button className="btn-approve" onClick={() => handleStatusUpdate(appt._id, 'approved')}>Approve</button>
                        <button className="btn-reject" onClick={() => handleStatusUpdate(appt._id, 'rejected')}>Reject</button>
                        <button className="btn-reschedule" onClick={() => handleRescheduleClick(appt)}>Reschedule</button>
                      </>
                    )}
                    
                    {user.role === 'user' && appt.status !== 'cancelled' && appt.status !== 'rejected' && (
                      <button className="btn-cancel" onClick={() => handleCancel(appt._id)}>Cancel Appointment</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
