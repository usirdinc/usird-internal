import React from 'react';

const AppointmentPage = () => (
  <div>
    <h1>Book an Appointment</h1>
    <form>
      <div>
        <input type="text" placeholder="Name" required />
      </div>
      <div>
        <input type="email" placeholder="Email" required />
      </div>
      <div>
        <input type="date" placeholder="Date" required />
      </div>
      <button type="submit">Book</button>
    </form>
  </div>
);

export default AppointmentPage;
