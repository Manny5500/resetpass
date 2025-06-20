'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient';
import { usePathname, useRouter } from 'next/navigation';
import '../globals.css';
const styles = {
  
primaryButton: {
  backgroundColor: '#008080',
  color: 'white',
  border: 'none',
  padding: '15px 30px',
  borderRadius: '8px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  width: '150px',
  textAlign: 'center',
},

secondaryButton: {
  backgroundColor: '#266c87',
  color: 'white',
  border: 'none',
  padding: '15px 30px',
  borderRadius: '8px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  width: '150px',
  textAlign: 'center',
},


  buttonHover: {
    backgroundColor: '#1976d2',
  },
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
  },
  
 
};

const baseUrl = "https://tmnsjojcksjeociimree.supabase.co/storage/v1/object/public/blueclock/dtr";

export default function NewPasswordPage() {
  const [dtrData, setDtrData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [modalImg, setModalImg] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [task, setTask] = useState(null);
  const [taskUser, setTaskUser] = useState({});
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [dtrData2, setDtrData2] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [session, setSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  
  const router = useRouter();
  const handleImageClick = (imgUrl, show) => {
  setModalImg(imgUrl);
  setShowModal(show);
  };

  const handleTaskClicked = (task, taskUser,  show) => {
      setTask(task);
      setTaskUser(taskUser);
      setShowTaskModal(show);
  }

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const startDateValue = `${year}-${month}-01`;
    const endDateValue = `${year}-${month}-${new Date(year, today.getMonth() + 1, 0).getDate().toString().padStart(2, '0')}`;
    setStartDate(startDateValue);
    setEndDate(endDateValue);

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
            router.push('/login');
            return
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

      
      let query = supabase
        .from('dtr_new')
        .select('*')
        .gte('date', startDateValue)
        .lte('date', endDateValue);

      if(currentUser[0] && currentUser[0].user_role === "10"){
        query = query.neq('user_role', "5")
      }else if(currentUser[0] && currentUser[0].user_role === "11"){
        query = query.eq('user_role', "5" )
      }
      query = query.order('date', {ascending : false})
      const { data: dtrData, error: dtrError } = await query

      if (!dtrError) {
        setDtrData(dtrData);
        setDtrData2(dtrData);
      }
      const { data: userData, error: userError } = await supabase.from('user').select('*');
      if (!userError) {
        setUserData(userData);
      }

      setSearchQuery('');
      handleImageClick('', false);
      handleTaskClicked('', '', false);
    };

    init();
  }, []);

  if (!session){
    return null;
  }else if(session && currentUser && currentUser.user_role !== "10" && currentUser.user_role !== "11"){
    return null;
  }


const searchDTR = (searchQuery, dtrData, userData) => {
  const cleanedQuery = searchQuery.trim().toLowerCase();
  const matchingAuthIds = userData
    .filter(user => {
      const fullName = `${user.first_name.trim()} ${user.last_name.trim()}`.toLowerCase();
      const firstName = user.first_name.toLowerCase().trim();
      const lastName = user.last_name.toLowerCase().trim();
      return fullName.includes(cleanedQuery) || firstName.includes(cleanedQuery) || lastName.includes(cleanedQuery);
    })
    .map(user => user.auth_id);


    const filteredDtr = dtrData.filter(dtr =>
      matchingAuthIds.includes(dtr.auth_id)
    );

    setDtrData2(filteredDtr);
};

const filterDtr = (searchQuery, dtrData, startDate, endDate, userData) => {
  setSearchQuery(searchQuery)
  setStartDate(startDate)
  setEndDate(endDate)

  const cleanedQuery = String(searchQuery).trim().toLowerCase();
    // Get matching user auth_ids based on full name match
  const matchingAuthIds = userData
    .filter(user => {
      const fullName = `${user.first_name.trim()} ${user.last_name.trim()}`.toLowerCase();
      const firstName = user.first_name.toLowerCase().trim();
      const lastName = user.last_name.toLowerCase().trim();
      return fullName.includes(cleanedQuery) || firstName.includes(cleanedQuery) || lastName.includes(cleanedQuery);
    })
    .map(user => user.auth_id);

    // Filter dtrData using the matching auth_ids
    const filteredDtr = dtrData
      .filter(dtr =>
        matchingAuthIds.includes(dtr.auth_id) &&
        dtr.date >= startDate &&
        dtr.date <= endDate
      )
   setDtrData2(filteredDtr);
};

const filterDate = async (searchQuery, startDate, endDate, userData, currentUser) => {
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

  let query = supabase.from('dtr_new')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate);

    if(currentUser && currentUser.user_role === "10"){
      console.log("im admin")
      query = query.neq('user_role', 5)
    }else if(currentUser && currentUser.user_role === "11"){
      query = query.eq('user_role', 5 )
    }

    query = query.order('date', {ascending : false})

  
  const { data, error } = await query
    

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
              <th style={styles.tableHeader}>Time In</th>
              <th style={styles.tableHeader}>Time In Image</th>
              <th style={styles.tableHeader}>Time In Location</th>
              <th style={styles.tableHeader}>Time Out</th>
              <th style={styles.tableHeader}>Time Out Image</th>
              <th style={styles.tableHeader}>Time Out Location</th>
              <th style={styles.tableHeader}>Task Details</th>
            </tr>
          </thead>
          <tbody>
            {dtrData2.map((item, index) => (
              <tr key={index}>
                <td style={styles.tableCell}>{getUser(item.auth_id, userData)}</td>
                <td style={styles.tableCell}>{item.date}</td>
                <td style={styles.tableCell}><span>{formatToAmPm(item.time_in)}</span></td>
                <td style={styles.tableCell}>
                   {item.time_in_img_url && item.time_in_img_url !== "" && (
                  <img
                    src={`${baseUrl}/${item.time_in_img_url}.png`}
                    alt="Time In"
                    style={styles.imageCell}
                    onClick={() => handleImageClick(`${baseUrl}/${item.time_in_img_url}.png`, true)}
                  />
                )}
                </td>
                <td style={styles.tableCell}>{item.time_in_location}</td>
                <td style={styles.tableCell}><span>{formatToAmPm(item.time_out)}</span></td>
                
                <td style={styles.tableCell}>
                  {item.time_out_img_url && item.time_out_img_url !== "" && (
                  <img
                    src={`${baseUrl}/${item.time_out_img_url}.png`}
                    alt="Time Out"
                    style={styles.imageCell}
                    onClick={() => handleImageClick(`${baseUrl}/${item.time_out_img_url}.png`, true)}
                  />
                )}
                </td>
                <td style={styles.tableCell}>{item.time_out_location}</td> 
                <td style={styles.tableCell}>
                     <button style={{ ...styles.primaryButton, marginBottom: '8px' }}
                        onMouseOver={e => (e.currentTarget.style.backgroundColor = '#006666')}
                        onMouseOut={e => (e.currentTarget.style.backgroundColor = '#008080')}
                        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
                        onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                         onClick = {() => handleTaskClicked(item.time_in_job, getRole(item.auth_id, userData), true )}
                        > Time In </button> 
                    <button
                        style={styles.secondaryButton}
                        onMouseOver={e => (e.currentTarget.style.backgroundColor = '#1f5a6e')}
                        onMouseOut={e => (e.currentTarget.style.backgroundColor = '#266c87')}
                        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
                        onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                         onClick = {() => handleTaskClicked(item.time_out_job, getRole(item.auth_id, userData), true )}
                     >Time Out </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
        {showModal && (
        <div className= "image-modal" onClick={() => setShowModal(false)}>
            <img
            src={modalImg}
            alt="Full Preview"
            style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: 8 }}
            />
        </div>
        )}

       {showTaskModal && (
        <div className="task-modal" onClick={() => setShowTaskModal(false)}>
          <div
            className="task-content"
            onClick={e => e.stopPropagation()} // prevent modal from closing when clicking inside
          >
          <h2>Task Details</h2> 
              {taskUser == "2" && task && (
                  <>
                  <p><strong>Job Type:</strong> {task.jobType}</p>
                  <p><strong>Job Status:</strong> {task.jobStatus}</p>
                  <p><strong>Client Name:</strong> {task.clientName}</p>
                  </>
              )}
              {taskUser == "3" && task && (
                  <>
                  <p><strong>Client Name:</strong> {task.clientName}</p>
                  <p><strong>Delivery Mode:</strong> {task.deliveryMode}</p>
                  <p><strong>Remarks:</strong> {task.remarks}</p>
                  </>
              )}

              {taskUser == "4" && task && (
                  <>
                  <p><strong>Purpose of Visit:</strong> {task.purposeOfVisit}</p>
                  <p><strong>Authorized By:</strong> {task.authorizedBy}</p>
                  <p><strong>Purpose Fulfilled:</strong> {task.purposedFulfilled}</p>
                  <p><strong>Remarks:</strong> {task.remarks}</p>
                  </>
              )}
              
              {taskUser == "5" && task && (
                  <>
                  <p><strong>Remarks:</strong> {task.remarks}</p>
                  </>
              )}
              { !task && (
                  <>
                  <p><strong>No Data</strong></p>
                  </>
              )}
          </div>
        </div>
      )}
      </div>
    </div>
  );

}

const formatToAmPm = (time) => {
  if (!time) return "";
  const date = new Date(`1970-01-01T${time}`);
  if (isNaN(date)) return "Invalid Time";
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const getUser = (authid, userData) => {
  if (!authid) return "";
  const user = userData.find(u => u.auth_id === authid);
  return user ? `${user.first_name}  ${user.last_name}  `: "";
};

const getRole = (authid, userData) => {
  if (!authid) return "";
  const user = userData.find(u => u.auth_id === authid);
  return user ? `${user.user_role}`: "";
};




