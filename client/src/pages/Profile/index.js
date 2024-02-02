import React from 'react'
import { Tabs } from "antd";
import PageTitle from "../../components/PageTitle";
import TheatreList from './TheatresList';
import Bookings from './Bookings';
 

const Profile = () => {
    return (
        <div>
          <PageTitle title="Business User" />
    
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Bookings" key="1">
                <Bookings />
            </Tabs.TabPane>
    
            <Tabs.TabPane tab="Apply for theaters" key="2">
                <TheatreList />
            </Tabs.TabPane>
          </Tabs>
        </div>
      );
}

export default Profile