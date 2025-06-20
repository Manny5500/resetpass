'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient';
import { usePathname, useRouter } from 'next/navigation';
import '../globals.css';

const styles = {
  tableHeader: {
    backgroundColor: '#1976d2',
    color: '#fff',
    padding: '12px 8px',
    fontWeight: '600',
    fontSize: '1rem',
    border: '1px solid #ccc',
  },
  tableCell: {
    padding: '10px 8px',
    fontSize: '0.95rem',
    color: '#333',
    textAlign: 'center',
    border: '1px solid #ddd',
  },
  imageCell: {
    width: 50,
    height: 50,
    objectFit: 'cover',
    objectPosition: 'center',
    borderRadius: 4, 
  }
};

const baseUrl = "https://tmnsjojcksjeociimree.supabase.co/storage/v1/object/public/blueclock/transpo";

export default function NewPasswordPage() {
  const [dtrData, setDtrData] = useState([]);  
  const [userData, setUserData] = useState([]);
  const [modalImg, setModalImg] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [dtrData2, setDtrData2] = useState([])
  const [session, setSession] = useState(null);
  const router = useRouter();


  const handleImageClick = (imgUrl, show) => {
    setModalImg(imgUrl);
    setShowModal(show); 
  };

  //for date
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const startDateValue = `${year}-${month}-01`;
  const endDateValue = `${year}-${month}-${new Date(year, today.getMonth() + 1, 0).getDate().toString().padStart(2, '0')}`;
  const [startDate, setStartDate] = useState(startDateValue);
  const [endDate, setEndDate] = useState(endDateValue);
  const [searchQuery, setSearchQuery] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {

     const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
            router.push('/login');
            return;
      }
      setSession(session);

      let userQuery = supabase
        .from('user')
        .select('*')
        .eq('auth_id', session.user.id);

      
      const {data : currentUser, error : currentUserError} = await userQuery
     
     
      if(!currentUserError){
        setCurrentUser(currentUser[0])
      }else{
        return
      }

  

      if (currentUser[0] && currentUser[0].user_role !== "10" && currentUser[0].user_role !== "11") {
        console.log(currentUser[0])
          router.push('/login');
          return;
      }

      let userDataQuery = supabase
        .from('user')
        .select('*')

      if(currentUser[0] && currentUser[0].user_role === "10"){
        userDataQuery = userDataQuery.neq('user_role', "5")
      }else if(currentUser[0] && currentUser[0].user_role === "11"){
        userDataQuery = userDataQuery.eq('user_role', "5" )
      }


      const { data: userData, error: userError } = await userDataQuery;
      if (!userError) {
        setUserData(userData);
      }
      
      const { data: dtrData, error: dtrError } = await supabase
        .from('transpo_details')
        .select('*')
        .gte('date', startDateValue)
        .lte('date', endDateValue)
        .order('date', { ascending: false });
      if (!dtrError) {
        const allowedAuthIds = userData.map(user => user.auth_id);
        const filteredDtrData = dtrData.filter(item => allowedAuthIds.includes(item.auth_id));
        setDtrData(filteredDtrData);
        setDtrData2(filteredDtrData);
      }
      
      setSearchQuery('');
      handleImageClick('', false);
    };

    init();
  }, []);

  if (!session){
            return null;
  };


const filterDtr = (searchQuery, dtrData, startDate, endDate, userData) => {
  setSearchQuery(searchQuery)
  setStartDate(startDate)
  setEndDate(endDate)
  const cleanedQuery = String(searchQuery).trim().toLowerCase();
  const matchingAuthIds = userData
    .filter(user => {
      const fullName = `${user.first_name.trim()} ${user.last_name.trim()}`.toLowerCase();
      const firstName = user.first_name.toLowerCase().trim();
      const lastName = user.last_name.toLowerCase().trim();
      return fullName.includes(cleanedQuery) || firstName.includes(cleanedQuery) || lastName.includes(cleanedQuery);
    })
    .map(user => user.auth_id);
    const filteredDtr = dtrData.filter(dtr =>
      matchingAuthIds.includes(dtr.auth_id) && dtr.date >= startDate && dtr.date <= endDate
    );

   setDtrData2(filteredDtr);
};

const filterDate = async (searchQuery, startDate, endDate, userData) => {
  setSearchQuery(searchQuery);
  setStartDate(startDate);
  setEndDate(endDate);

  const cleanedQuery = searchQuery.trim().toLowerCase();

  const matchingAuthIds = userData
    .filter(user => {
      const fullName = `${user.first_name.trim()} ${user.last_name.trim()}`.toLowerCase();
      const firstName = user.first_name.toLowerCase().trim();
      const lastName = user.last_name.toLowerCase().trim();
      return fullName.includes(cleanedQuery) || firstName.includes(cleanedQuery) || lastName.includes(cleanedQuery);
    })
    .map(user => user.auth_id);

  const { data, error } = await supabase
    .from('transpo_details')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) {
    //console.error(error);
    setDtrData2([]);
    return;
  }

  const filteredDtr = data.filter(dtr =>
    matchingAuthIds.includes(dtr.auth_id)
  );

  setDtrData2(filteredDtr);
};


return (
    <div className="container">
      <div className="card"> 
        <div className="flex-gap">
        <div className="flex-column">
            <label className="label-search">Search</label>
            <input
              type="text"
              placeholder="Search..."
              className="input-search"
              onChange={(e) => filterDtr(e.target.value, dtrData, startDate, endDate, userData)}
            />
        </div>
        
        <div className="flex-1-column">
            <label className="label-search">Start Date</label>
            <input
              type="date"
              value={startDate}
              className="input-date"
              onChange={(e) =>  filterDate(searchQuery,  e.target.value, endDate , userData)}
            />
        </div>

        <div className="flex-1-column">
            <label className="label-search">End Date</label>
            <input
              type="date"
              value={endDate}
              className="input-date"
              onChange={(e) => filterDate(searchQuery, startDate, e.target.value , userData)}
            />
        </div>
      </div>
        <table className="table-full">
          <thead>
            <tr>
              <th style={styles.tableHeader}>Employee</th>
              <th style={styles.tableHeader}>Date</th>
              <th style={styles.tableHeader}>Origin</th>
              <th style={styles.tableHeader}>Destination</th>
              <th style={styles.tableHeader}>Transpo Type</th>
              <th style={styles.tableHeader}>Transpo Amount</th>
              <th style={styles.tableHeader}>Meal Allowance</th>
              <th style={styles.tableHeader}>Other Allowance</th>
              <th style={styles.tableHeader}>Receipt</th>
              <th style={styles.tableHeader}>Total</th>
            </tr>
          </thead>
          <tbody>
            {dtrData2.map((item, index) => (
              <tr key={index}>
                <td style={styles.tableCell}>{getUser(item.auth_id, userData)}</td>
                <td style={styles.tableCell}>{item.date}</td>
                <td style={styles.tableCell}>{item.origin}</td>
                <td style={styles.tableCell}>{item.destination}</td>
                <td style={styles.tableCell}>{item.transpo_type}</td>
                <td style={styles.tableCell}>{item.transpo_amount}</td>
                <td style={styles.tableCell}>{item.meal_allowance}</td>
                <td style={styles.tableCell}>
                  {Object.entries(item.other_allowance).map(([key, value]) => `${key}: ${value}`).join(', ')}
                </td>
                <td style={styles.tableCell}>
                   {item.image_name !== "" && (
                  <img
                    src={`${baseUrl}/${item.image_name}.png`}
                    alt="Time In"
                    style={styles.imageCell}
                    onClick={() => handleImageClick(`${baseUrl}/${item.image_name}.png`, true)}
                  />
                )}
                </td>
                <td style={styles.tableCell}>
                    {
                        Object.values(item.other_allowance).reduce((sum, val) => sum + Number(val), 0) +
                        Number(item.meal_allowance) +
                        Number(item.transpo_amount)
                    }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showModal && (
        <div className="image-modal" onClick={() => setShowModal(false)}>
            <img
            src={modalImg}
            alt="Full Preview"
            style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: 8 }}
            />
        </div>
        )}

      </div>
    </div>
  );
}

const getUser = (authid, userData) => {
  if (!authid) return "";
  const user = userData.find(u => u.auth_id === authid);
  return user ? `${user.first_name}  ${user.last_name}  `: "";
};




