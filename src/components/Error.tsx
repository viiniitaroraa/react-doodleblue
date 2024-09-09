import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';


const Error: React.FC = () => {
    const { error } = useSelector((state: RootState) => state.products);
    return (
        <div className="py-4">
            <div className="container">
                <div className='no-data'>
                    <p>{error}</p>
                </div>
            </div>
        </div>
    );
};

export default Error;


