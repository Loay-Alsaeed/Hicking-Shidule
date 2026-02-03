import React from "react";
import {useState, useEffect} from "react";
import { useTrips } from "../Context/TripContext";
import { AiOutlineUserDelete } from "react-icons/ai";

const TripMembersModel = ({isClose, isOpen}) => {
    const { membersTrip, loading, removeMemberFromTrip } = useTrips();

    useEffect(()=> {
        const handleScroll = () => {
            console.log('scroll');
            isClose();
        }


        window.addEventListener('scroll', handleScroll)
    },[])

    if (!isOpen) return null;
    return (
        <>
     
            {loading? 
        
            <div className="w-full h-full font-bold text-2xl">
                <h3 className="inset-0 ">Loading</h3>
            </div>
        
        :
        
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 "> 
            <div className="bg-gray-100 rounded-xl shadow-xl max-w-4xl max-h-[90vh] w-[90%] overflow-hidden">
                <div className="flex items-center justify-between p-3 border-b">
                    <h2 className="font-semibold">Members of Trip</h2>
                    <button onClick={isClose} className="px-2 cursor-pointer hover:text-red-500">✕</button>
                </div>
            <div className="">
                <table className="w-full "> 
                    <thead className="bg-gray-100">
                        <tr className="">
                            <td className="p-2">Name</td>
                            <td className="p-2">Email</td>
                            <td className="p-2"></td>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-100">
                        {membersTrip && membersTrip.length === 0? (<>
                        <tr>
                            <td colSpan="3" className="p-2">
                                <div className="text-center text-gray-500">no one register in this trip</div>
                            </td>
                        </tr>
                        </>):(<>
                        {membersTrip.map((member) => (
                            <tr>
                                <td className="p-2">{member.userName}</td>
                                <td className="p-2">{member.userEmail}</td>
                                <td className="p-2 text-xl cursor-pointer hover:text-red-500"
                                    onClick={() => { 
                                    console.log('tripId: ',member.tripId)
                                    console.log('userId: ',member.userId)
                                    removeMemberFromTrip(member.tripId, member.userId)}}><AiOutlineUserDelete />
                                </td>
                            </tr>
                         ))}
                        </>)}

                    
                    </tbody>
               
                
                 </table>
            </div>
            </div>
        </div>
        }
        </>
    )
}
export default TripMembersModel;