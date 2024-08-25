import React from 'react';

const services = [
  { imageSrc: '/path/to/women-salon.png', title: "Women's Salon & Spa", category: 'women-salon' },
  { imageSrc: '/path/to/men-salon.png', title: "Men's Salon & Massage", category: 'men-salon' },
  { imageSrc: '/path/to/ac-repair.png', title: 'AC & Appliance Repair', category: 'ac-repair' },
  { imageSrc: '/path/to/cleaning.png', title: 'Cleaning & Pest Control', category: 'cleaning' },
  { imageSrc: '/path/to/electrician.png', title: 'Electrician, Plumber & Carpenter', category: 'electrician' },
  { imageSrc: '/path/to/water-purifier.png', title: 'Native Water Purifier', category: 'water-purifier' },
  { imageSrc: '/path/to/smart-locks.png', title: 'Native Smart Locks', category: 'smart-locks' },
  { imageSrc: '/path/to/painting.png', title: 'Painting & Decor', category: 'painting' }
];

const Icons = ({ onSelect }) => {
  return (
    <div className="row">
      {services.map(service => (
        <div className="col-md-4 mb-4" key={service.category}>
          <div className="card text-center" onClick={() => onSelect(service.category)} style={{ cursor: 'pointer' }}>
            <img src={service.imageSrc} className="card-img-top" alt={service.title} />
            <div className="card-body">
              <h5 className="card-title">{service.title}</h5>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Icons;
