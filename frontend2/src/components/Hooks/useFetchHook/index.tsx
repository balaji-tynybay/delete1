import { useState, useEffect } from "react";
import axios from "axios";
// import { accessToken } from "../../Dashboard/token";

const useMultipleUrlData = (
  urls: any,
  startDate?: string,
  groupBy?: string,
  prediction?: string,
  previousStartDate?: string,
  selectedFilter? :any
 
) => {
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);



  useEffect(() => {
    const fetchData = async () => {
      try {
        // setIsLoading(true)
        const responseArray = await Promise.all(
          urls.map(async (url: string, index: number) => {
            await new Promise((resolve) => setTimeout(resolve, index * 1000));
            return axios.get(url, {
              headers: {
                
                "Content-Type": "application/json",
              },
            });
          })
        );
        const responseData = responseArray.map((response) => response.data);
        setData(responseData);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };
  
    fetchData()
 
  }, []);
  return { data, isLoading, error };
};

export default useMultipleUrlData;



// import { useState, useEffect } from "react";
// import axios from "axios";
// import { accessToken } from "../../Dashboard/token";

// const useMultipleUrlData = (
//   urls: any,
//   startDate?: string,
//   groupBy?: string,
//   prediction?: string,
//   selectedType?: string,
//   previousStartDate?: string
// ) => {
//   const [data, setData] = useState<any>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<any>(null);
//   const [buttonClicked, setButtonClicked] = useState(false);

//   useEffect(() => {
//     if (buttonClicked) {
//       const fetchData = async () => {
//         setIsLoading(true);
//         setError(null);
        
//         try {
//           const responseArray = await Promise.all(
//             urls.map(async (url: string, index: number) => {
//               await new Promise((resolve) => setTimeout(resolve, index * 1000));
//               return axios.get(url, {
//                 headers: {
//                   Authorization: `Bearer ${accessToken}`,
//                   "Content-Type": "application/json",
//                 },
//               });
//             })
//           );
//           const responseData = responseArray.map((response) => response.data);
//           setData(responseData);
//           setIsLoading(false);
//         } catch (error) {
//           setError(error);
//           setIsLoading(false);
//         }
//       };
  
//       fetchData();
//     }
//   }, [buttonClicked, startDate, groupBy, prediction, selectedType, previousStartDate]);

//   const handleClick = () => {
//     setButtonClicked(true);
//   };

//   return { data, isLoading: isLoading || buttonClicked, error, handleClick };
// };

// export default useMultipleUrlData;
