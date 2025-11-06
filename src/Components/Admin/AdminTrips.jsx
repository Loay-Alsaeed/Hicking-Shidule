import { useEffect, useState } from "react";
import { useTrips } from "../../Context/TripContext";
import TripCard from "../TripCard";
import TripDetails from "../TripDetails";
import AddTripModal from "../AddTripModal";

const AdminTrips = () => {
    const {trips, selectedTrip, loading, fetchTrips} = useTrips();
    const [isAddTripModalOpen, setIsAddTripModalOpen] = useState(false);

    useEffect(() => {
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        fetchTrips(month, year);
    }, []);

    return (
        <>
        {/* <div className="pb-6 flex justify-between">
            <h2 className="font-semibold text-2xl text-gray-600">Welcome Back</h2>
            <button className="bg-blue-700 active:bg-blue-700 px-6  rounded-md  text-gray-100 font-semibold text-sm flex gap-2 items-center">
                <p>Add Trip</p>
                <span className="text-xl ">+</span>
            </button>
        </div> */}

        {loading ? 
        <p>Loading</p> : 
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 lg:col-span-2">
                <TripCard tripsShow={trips}/>
            </div>
            <div className="col-span-1 lg:col-span-1">
                <TripDetails/>
            </div>
        </div>
        }
            <AddTripModal 
            isOpen={isAddTripModalOpen} 
            onClose={() => setIsAddTripModalOpen(false)} 
            />
        </>
    );
}
export default AdminTrips;