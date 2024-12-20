import React from 'react';

const Home = React.forwardRef((props, ref) => (
    <div ref={ref}>
        <h1>Home Section</h1>
        {/* Other content */}
    </div>
));

export default Home;
