import './App.css';
import {Col, Divider, Modal, Progress, Row, Select} from "antd";
import {useEffect, useState} from "react";
import {getInstance} from "d2";
import HeaderBar from "@dhis2/d2-ui-header-bar"
import {Button, Pane, Text} from "evergreen-ui";
import axios from "axios";


function App(props) {

  const [D2, setD2] = useState();
  const [alertModal, setAlertModal] = useState(false);
  const [status, setStatus] = useState(0);
  const [statusText, setStatusText] = useState("normal");
  const [messageText, setMessageText] = useState("Processing...");
  const [groups, setGroups] = useState(props.userGroups);
  const [roles, setRoles] = useState(props.userRoles);
  const [users, setUsers] = useState(props.users);
  const [auth, setAuth] = useState(props.auth);
  const [orgUnits, setOrgUnits] = useState(props.orgUnits);
  const [selectedGroup, setSelectedGroup] = useState(null);

  getInstance().then(d2 =>{
    setD2(d2);
  });

  useEffect(() => {
    setAuth(props.auth);
    setGroups(props.userGroups);
    setUsers(props.users);
    setRoles(props.userRoles);
    setOrgUnits(props.orgUnits);
  }, [props]);

  const handleUserGroup = (option) => {
    setSelectedGroup(option);
  }

  const handleCancel = () => {
    setAlertModal(false);
  };

  const changeOrgUnit = () => {
    setAlertModal(true);
    setStatus(0);
    var tempArray = [];
    var userGroup = groups[groups.findIndex(x => x.id === selectedGroup)];

    var usered = userGroup&&userGroup.users;
    usered.map((user) => {
      var orgUser = users[users.findIndex(x => x.id === user.id)];
      var units = orgUser&&orgUser.organisationUnits;

      units&&units.map((unit) => {
         var org = orgUnits[orgUnits.findIndex(x => x.id === unit.id)];
         unit.parent = org && org.parent && org.parent.id;
      });

      tempArray.push(orgUser);

    });
    setStatus(20);


    var payloadArray = [];
    tempArray.map((user, index) => {

      setStatus(40);
      console.log(user);
      var teiArray = [];
      user.organisationUnits.map((unit) => {

        var tei = unit.parent ? {"id" : unit.parent} : {};
        teiArray.push(tei);
        delete unit.parent;
      });

      console.log(teiArray);

      var payload = {
        "id": user.id,
        "firstName": user.firstName,
        "surname": user.surname,
        "userCredentials": {
          "id": user.id,
          "userInfo": {
            "id": user.userCredentials.userInfo.id
          },
          "username": user.userCredentials.username,
        },
        "organisationUnits": user.organisationUnits,
        "userGroups": user.userGroups,
        "dataViewOrganisationUnits": user.dataViewOrganisationUnits,
        "teiSearchOrganisationUnits": teiArray,
      }


      payloadArray.push(payload);

    });

    setStatus(80);
    console.log(payloadArray);


    Promise.all(payloadArray.map((item) => axios.put(`https://ccdev.org/chistest/api/users/${item.id}`,item,{
      auth: {
        username: "atwabi",
        password: "@Itwabi1234"
      }
    }, item))).then((data)=> {
      console.log(data);
      setStatus(100);
      setStatusText("success");
      setMessageText("orgunit successfully changed");
    }).catch((error) => {
      setStatus(100);
      setStatusText("exception");
      setMessageText("Unable to change search orgUnits, an error occurred: " + error);
    })




  }

  return (
      <div className="App">
        <div>
          {D2 && <HeaderBar className="mb-5" d2={D2}/>}
          <Modal visible={alertModal} onOk={()=>{handleCancel()}} onCancel={()=>{handleCancel()}} footer={false}>
            <div className="d-flex flex-column w-100 align-items-center py-4">
              <Text size={800} classname="mb-3">
                <b>{messageText}</b>
              </Text>
              <Progress type="circle" className="mt-3" percent={status} status={statusText}/>
            </div>

          </Modal>
          <div className="mt-5 d-flex justify-content-center align-items-center">
            <Pane
                elevation={1}
                float="left"
                margin={24}
                className="w-75 p-4"
                display="flex"
                background="tint2"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
            >
              <h5>
                <strong>Change User Search</strong>
              </h5>

              <Text size={500}>
                <strong>Select the user group to change search orgUnit to Parent</strong>
              </Text>

              {[].length !== 0 ? <div className="spinner-border mx-2 indigo-text spinner-border-sm" role="status">
                <span className="sr-only">Loading...</span>
              </div> : null}

              <Divider className="mx-2" plain/>

              <Row className="w-50 mt-3">
                <Col span={24}>
                  <div className="text-left my-3 d-flex flex-column">
                    <label className="grey-text ml-2">
                      <strong>Select user group</strong>
                    </label>
                    <Select placeholder="select user group"
                            style={{ width: '100%' }}
                            size="large"
                            className="mt-2"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={handleUserGroup}>
                      {groups.map((item, index) => (
                          <Select.Option key={index} value={item.id}>{item.displayName}</Select.Option>
                      ))}

                    </Select>

                  </div>
                </Col>


              </Row>
              <Row className="w-25 mt-4">
                <Col span={24}>
                  <Button appearance="primary" onClick={changeOrgUnit}>
                    POST
                  </Button>
                </Col>
              </Row>
            </Pane>
          </div>
        </div>
      </div>
  );
}

export default App;
