import { useState, useEffect } from "react";
import axios from "axios";

const dummyData = [
    {
        "obj_id": 1,
        "date": "2023-08-13",
        "time": "18:22",
        "message": "Road Block on ECP (towards Changi Airport) after Still Rd Sth Exit. Avoid lane 3",
        "location": "1.30398068448214,103.919182834377",
        "obj_type": "road closure",
        "address": "ECP, Singapore 469000"
    },
    {
        "obj_id": 2,
        "date": "2023-08-13",
        "time": "19:05",
        "message": "Accident on PIE (towards Jurong) after Adam Rd Exit. Expect Delays.",
        "location": "1.333650,103.797570",
        "obj_type": "road accident",
        "address": "PIE, Singapore 289883"
    },
    {
        "obj_id": 3,
        "date": "2023-08-13",
        "time": "20:12",
        "message": "Heavy traffic on AYE (towards Marina Coastal Expressway) before Jurong Town Hall Rd Exit.",
        "location": "1.320684,103.748571",
        "obj_type": "traffic jam",
        "address": "AYE, Singapore 609434"
    },
    {
        "obj_id": 4,
        "date": "2023-08-13",
        "time": "20:30",
        "message": "Construction work on KPE (towards TPE) before Tampines Rd Exit. Lane closure.",
        "location": "1.352060,103.878589",
        "obj_type": "road closure",
        "address": "KPE, Singapore 534167"
    },
    {
        "obj_id": 5,
        "date": "2023-08-13",
        "time": "21:45",
        "message": "Flooding on BKE (towards PIE) after Dairy Farm Rd Exit. Use alternative routes.",
        "location": "1.364742,103.772815",
        "obj_type": "road closure",
        "address": "BKE, Singapore 677732"
    }
];

const useFetch = (endpoint, query) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const options = {
        method: "GET",
        url: `https://jsearch.p.rapidapi.com/${endpoint}`,
        headers: {
        "X-RapidAPI-Key": '',
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
        params: { ...query },
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
        /*
        const response = await axios.request(options);

        setData(response.data.data);
        */
            setData(dummyData);
            setIsLoading(false);
        } catch (error) {
            setError(error);
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const refetch = () => {
        setIsLoading(true);
        fetchData();
    };

    return { data, isLoading, error, refetch };
};

export default useFetch;