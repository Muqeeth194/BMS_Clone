import React, { useEffect } from "react";
import Button from "../../components/Button";
import TheatreForm from "./TheatreForm";
import moment from "moment";
import { message, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, Showloading } from "../../redux/loadersSlice";
import { GetAllTheatresByOwner, DeleteTheatre } from "../../apicalls/theatres";
import Shows from "./Shows";

function TheatresList() {
// Get the user ID from the redux store
    const { user } = useSelector((state)=> state.users)


  const [theatres, setTheatres] = React.useState([]);
  const [showTheatreFormModal, setShowTheatreFormModal] = React.useState(false);
  const [openShowsModal, setOpenShowsModal] = React.useState(false);
  const [selectedTheatre, setSelectedTheatre] = React.useState(null);
  const [formType, setFormType] = React.useState("add");
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(Showloading());
      const response = await GetAllTheatresByOwner(user._id);
      dispatch(HideLoading());

      if (response.success) {
        setTheatres(response.data);
      } else {
        message.error(response.message);
      }
      
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };


const handleDelete = async (theatreId) => {
    try {
      dispatch(Showloading())
      const response = await DeleteTheatre({theatreId})
      dispatch(HideLoading())

      if(response.success){
        message.success(response.message)
        getData()
      } else{
        message.error(response.message)
      }
    } catch (error) {
      dispatch(HideLoading())
      message.error(error.message)
    }
}

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },

    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Status",
      dataIndex: "isActive",
    //   text is the response from the database; record is an obejct from theatre state
      render:  (text, record) => {
        if(text){
            return "Approved"
        }else {
            return "Pending / Blocked"
        }
      }
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-1">
            <i
              className="ri-delete-bin-line"
                onClick={() => {
                  handleDelete(record._id)
                }}
            ></i>
            <i
              className="ri-pencil-line"
                onClick={() => {
                  setSelectedTheatre(record)
                  setFormType('edit')
                  setShowTheatreFormModal(true)
                }}
            ></i>
            {record.isActive && (
              <span className="underline"
                onClick={()=>{
                  setSelectedTheatre(record)
                  setOpenShowsModal(true)
                }}>
                Shows
              </span>
              
            )}
          </div>
        );
      },
    },
  ];

  
  useEffect(() => {
    getData();
  }, []);
  

  return (
    <div>
      <div className="flex justify-end mb-1">
        <Button
          title="Add Theatre"
          variant="outlined"
          onClick={() => {
            setShowTheatreFormModal(true);
            setFormType("add");
          }}
        />
      </div>

      <Table columns={columns} dataSource={theatres} />

      {showTheatreFormModal && (
        <TheatreForm
          showTheatreFormModal={showTheatreFormModal}
          setShowTheatreFormModal={setShowTheatreFormModal}
          selectedTheatre={selectedTheatre}
          setSelectedTheatre={setSelectedTheatre}
          formType={formType}
          getData={getData}
        />
      )}

      {openShowsModal && (
        <Shows 
          openShowsModal={openShowsModal}
          setOpenShowsModal={setOpenShowsModal}
          theatre={selectedTheatre}
        />
      )}
    </div>
  );
}

export default TheatresList;