import React from 'react';
import '../css/MainHeadTitle.css'; 

function MainHeadTitle({ title, subtitle }) {
  return (
    <section className="main-head-title">
      <div className="content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
}

export default MainHeadTitle;
