import { Table, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { HideLoading, Showloading } from "../../redux/loadersSlice";
import { GetAllTheatres, UpdateTheatre } from '../../apicalls/theatres';

const TheatreList = () => {
  const [theatres, setTheatres] = useState([])
  const dispatch = useDispatch()

  const getData = async() => {
    try {
      dispatch(Showloading())
      const response = await GetAllTheatres()
      if(response.success){
        setTheatres(response.data)
      }else{
        message.error(response.message)
      }
      dispatch(HideLoading())
    } catch (error) {
      message.error(error)
      dispatch(HideLoading())
    }
  }

  const handleStatusChange = async(theatre) => {
    try {
      dispatch(Showloading())
      const response = await UpdateTheatre({
        ...theatre,
        theatreId: theatre._id,
        isActive: !theatre.isActive
      })
      if(response.success){

        // setTheatres(response.data) //Renders the whole page and is not required as the latest data from the DB will be fetched in the next line
        getData()
      }else{
        message.error(response.message)
      }
      dispatch(HideLoading())
    } catch (error) {
      message.error(error)
      dispatch(HideLoading())
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
      title: "Owner",
      dataIndex: "owner",
      render: (text, record) => {
        return record.owner.name;
      },
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (text, record) => {
        if (text) {
          return "Approved";
        } else {
          return "Pending / Blocked";
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-1">
            {record.isActive && (
              <span
                className="underline"
                 onClick={() => handleStatusChange(record)}
              >
                Block
              </span>
            )}
            {!record.isActive && (
              <span
                className="underline"
                onClick={() => handleStatusChange(record)}
              >
                Approve
              </span>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getData()
  }, [])

  return (
    <div>
      <Table columns={columns} dataSource={theatres}/>
    </div>
  )
}

export default TheatreList