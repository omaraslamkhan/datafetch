const axios = require("axios").default;

const meetingsUrl =
  "https://meeting-app-v2.herokuapp.com/meetings?_end=1000000&_order=ASC&_sort=id&_start=0";
  
let baseUrl = "https://meeting-app-v2.herokuapp.com/meetings/";
let baseUrll="https://meeting-app-v2.herokuapp.com/"

let meetingIds = [];


async function getDpt(){
try{
  const departments=await axios.get(baseUrll+'departments?_end=1000000&_order=DESC&_sort=id&_start=0')
 
 departments.data.forEach((el)=>{

  console.log("INSERT INTO"+"`departments`"+"("+"`id`"+","+"`name`"+","+"`created_at`"+","+"`updated_at`"+ ")"+"VALUES"+"("+"'"+`${el.id}`+"'"+","+"'"+`${el.name}`+"'"+","+"'"+`${el.created_at}`+"'"+","+"'"+`${el.updated_at}`+"'"+");");
 })
}
catch(err){
  console.log('kkkkkkkkkkkkkkkkkkk')
  console.log(err)
}
}



async function getUsers(){

    try{
        const user=await axios.get(baseUrll+'users?_end=1000000&_order=DESC&_sort=id&_start=0')
        user.data.forEach((list)=>{
            let user={
                id:'',
                firstName:'',
                lastName:'',
                email:'',
                isFixedForReport:'',
                hasAdminRights:'',
                created_at:'',
                updated_at:'',
                departmentId:''
            }
            user.id=list.id;
            user.firstName=list.firstName;
            user.lastName=list.lastName;
            user.email=list.email;
            user.isFixedForReport=0;
            user.hasAdminRights=list.hasAdminRights;
            user.departmentId=list.department?list.department.id:null

            console.log("INSERT INTO"+"`users`"+"("+"`id`"+","+"`firstName`"+","+"`lastName`"+","+"`email`"+","+"`initial`"+","+"`isFixedForReport`"+","+"`hasAdminRights`"+","+"`created_at`"+","+"`updated_at`"+","+"`departmentId`"+ ")"+"VALUES"+"("+"'"+`${user.id}`+"'"+","+"'"+`${user.firstName}`+"'"+","+"'"+`${user.lastName}`+"'"+","+"'"+`${user.email}`+"'"+","+"'"+`null`+"'"+","+"'"+`${user.isFixedForReport}`+"'"+","+"'"+`${user.hasAdminRights}`+"'"+","+"'"+`${user.created_at}`+"'"+","+"'"+`${user.updated_at}`+"'"+","+`${user.departmentId}`+");");

        })
        
    }catch(err){}
}

async function getMeetings() {
  try {
    const meetings = await axios.get(meetingsUrl);
    meetings.data.forEach((elem) => {
      meetingIds.push(elem.id);
    });

    const meetingUrls = await getMeetingIdArray(meetingIds);
    const meetingData = await getMeetingData(meetingUrls);
    builder(meetingData,'agendas')
  } catch (error) {
    console.error(error);
  }
}

async function getMeetingIdArray(ids) {
  let urls = [];
  ids.forEach((Id) => {
    urls.push(baseUrl + Id);
  });
  return urls;
}

async function getMeetingData(meetingIdArray) {
  const meetingData = await axios
    .all(
      meetingIdArray.map((urls) => {
        return axios.get(urls);
      })
    )
    .then(
      axios.spread((...responses) => {
        let allMeetingRes = responses.map((idata) => {
          return idata.data;
        });
        return allMeetingRes;

        // use/access the results
      })
    )
    .catch((errors) => {
      // react on errors.
    });
  return meetingData;
}

//  getMeetings();
// getUsers();
getDpt();

const builder = (data,field) => {

    switch(field) {
      case 'meeting':
        data.forEach((el)=>{

         console.log("INSERT INTO"+"`meetings`"+"("+"`id`"+","+"`subject`"+","+"`created_at`"+","+"`updated_at`"+","+"`organizerId`"+","+"`departmentId`"+")"+"VALUES"+"("+"'"+`${el.id}`+"'"+","+"'"+`${el.subject}`+"'"+","+"'"+`${el.created_at}`+"'"+","+"'"+`${el.updated_at}`+"'"+","+"'"+`${el.organizer.id}`+"'"+","+"'"+`${el.department.id}`+"'"+");");

        })
        break;
        case 'tasks':

          
  let tasksData = {
    id: "",
    created_at: "",
    updated_at: "",
    agendaId: "",
  };

  data.forEach((el)=>{
    el.agendas.forEach((element, key) => {

      element.tasks.forEach((task, index) => {
        tasksData.id = task.id;
        tasksData.created_at = task.created_at;
        tasksData.updated_at = task.updated_at;
        tasksData.agendaId = element.id;
  
        //tasks
         console.log("INSERT INTO"+"`tasks`"+"("+"`id`"+","+"`created_at`"+","+"`updated_at`"+","+"`agendaId`"+")"+"VALUES"+"("+"'"+`${tasksData.id}`+"'"+","+"'"+`${tasksData.created_at}`+"'"+","+"'"+`${tasksData.updated_at}`+"'"+","+"'"+`${tasksData.agendaId}`+"'"+");");
  
      });
  
    });
  })
 
          break;

        case 'agendas':
            let agendaData = {
                id: "",
                agenda: "",
                created_at: "",
                updated_at: "",
                meetingId: "",
              };
              data.forEach((elem)=>{
                elem.agendas.forEach((element, key) => {
                  agendaData.meetingId=data[key].id;
                  agendaData.id = element.id;
                  agendaData.agenda = element.agenda;
                  agendaData.created_at = element.created_at;
                  agendaData.updated_at = element.updated_at;
            
              
            
                // agendas
                  console.log("INSERT INTO"+"`agendas`"+"("+"`id`"+","+"`agenda`"+","+"`created_at`"+","+"`updated_at`"+","+"`meetingId`"+")"+"VALUES"+"("+"'"+`${agendaData.id}`+"'"+","+"'"+`${agendaData.agenda}`+"'"+","+"'"+`${agendaData.created_at}`+"'"+","+"'"+`${agendaData.updated_at}`+"'"+","+"'"+`${agendaData.meetingId}`+"'"+");");
              });
              })

          break;

          case 'task_assignees':
            let taskAssignee = {
                tasksId: "",
                usersId: "",
               
              };

              data.forEach((dig,index)=>{
        
                dig.agendas.forEach((element, index) => {
                element.tasks.forEach((task,key)=>{
                    task.assignees.forEach(assigneeId => {
                        // console.log('taskId:',task.id+'assigneeId:'+assigneeId)
                    taskAssignee.tasksId=task.id
                    taskAssignee.usersId=assigneeId

               console.log("INSERT INTO"+"`tasks_assignees_users`"+"("+"`tasksId`"+","+"`usersId`"+")"+"VALUES"+"("+"'"+`${taskAssignee.tasksId}`+"'"+","+"'"+`${taskAssignee.usersId}`+"'"+");");

                    });

                })
            // tasks assignees
            //   console.log("INSERT INTO"+"`tasks_assignees_users`"+"("+"`tasksId`"+","+"`usersId`"+")"+"VALUES"+"("+"'"+`${taskAssignee.tasksId}`+"'"+","+"'"+`${taskAssignee.usersId}`+"'"+");");
          });
              })

              break;
       
       case 'sessions':

        let sessionsObj = {
          id: "",
          startDate: "",
          endDate: "",

          created_at: "",
          updated_at: "",
          meetingId: "",

                  
        };
        data.forEach((el)=>{
        el.sessions.forEach((element)=>{
            sessionsObj.meetingId=el.id
            sessionsObj.id=element.id
            sessionsObj.startDate=element.startDate
            sessionsObj.endDate=element.endDate
            sessionsObj.created_at=element.created_at
            sessionsObj.updated_at=element.updated_at

        console.log("INSERT INTO"+"`sessions`"+"("+"`id`"+","+"`startDate`"+","+"`endDate`"+","+"`created_at`"+","+"`updated_at`"+","+"`meetingId`"+")"+"VALUES"+"("+"'"+`${sessionsObj.id}`+"'"+","+"'"+`${sessionsObj.startDate}`+"'"+","+"'"+`${sessionsObj.endDate}`+"'"+","+"'"+`${sessionsObj.created_at}`+"'"+","+"'"+`${sessionsObj.updated_at}`+"'"+","+"'"+`${sessionsObj.meetingId}`+"'"+");");

        })
        })
        // data.forEach((dig,index)=>{
  
        //   dig.agendas.forEach((element, index) => {
        //   element.tasks.forEach((task,key)=>{
        //       task.assignees.forEach(assigneeId => {
        //           // console.log('taskId:',task.id+'assigneeId:'+assigneeId)
        //       taskAssignee.tasksId=task.id
        //       taskAssignee.usersId=assigneeId

        //  console.log("INSERT INTO"+"`sessions`"+"("+"`id`"+","+"`startDate`"+","+"`endDate`"+","+"`created_at`"+","+"`updated_at`"+","+"`meetingId`"+")"+"VALUES"+"("+"'"+`${sessionsObj.id}`+"'"+","+"'"+`${sessionsObj.startDate}`+"'"+","+"'"+`${sessionsObj.endDate}`+"'"+","+"'"+`${sessionsObj.created_at}`+"'"+","+"'"+`${sessionsObj.updated_at}`+"'"+","+"'"+`${sessionsObj.meetingId}`+"'"+");");

        //       });

        //   })


       
           break;
       
           case 'session_participants':
            let sessionUsersObj = {
                sessionsId: "",
                usersId: ""
               
              };

              data.forEach(dig => {
                dig.sessions.forEach((element, index) => {
                  element.participants.forEach((userIds)=>{
                    sessionUsersObj.sessionsId=element.id
                    sessionUsersObj.usersId=userIds
               console.log("INSERT INTO"+"`sessions_participants_users`"+"("+"`sessionsId`"+","+"`usersId`"+")"+"VALUES"+"("+"'"+`${sessionUsersObj.sessionsId}`+"'"+","+"'"+`${sessionUsersObj.usersId}`+"'"+");");

                  })
                })

              });
              // data.forEach((dig,index)=>{
        
              //   dig.agendas.forEach((element, index) => {
              //   element.tasks.forEach((task,key)=>{
              //       task.assignees.forEach(assigneeId => {
              //           // console.log('taskId:',task.id+'assigneeId:'+assigneeId)
              //       taskAssignee.tasksId=task.id
              //       taskAssignee.usersId=assigneeId

              //  console.log("INSERT INTO"+"`tasks_assignees_users`"+"("+"`tasksId`"+","+"`usersId`"+")"+"VALUES"+"("+"'"+`${taskAssignee.tasksId}`+"'"+","+"'"+`${taskAssignee.usersId}`+"'"+");");

              //       });

              //   })
            


              break;
       
              case 'points':
                let pointsObj={
                  id:'',
                  originalDate:'',
                   text:'', 
                   targetDate:'',
                    status:'', 
                    created_at:'',
                     updated_at:'', 
                     taskId:''
                }
                data.forEach((el)=>{
                    el.agendas.forEach((agnd)=>{
                      agnd.tasks.forEach((tsk)=>{
                        tsk.points.forEach((point)=>{



               console.log("INSERT INTO"+"`points`"+"("+"`id`"+","+"`originalDate`"+","+"`text`"+","+"`targetDate`"+","+"`status`"+","+"`created_at`"+","+"`updated_at`"+","+"`taskId`"+")"+"VALUES"+"("+"'"+`${point.id}`+"'"+","+"'"+`${point.originalDate}`+"'"+","+"'"+`${point.text}`+"'"+","+"'"+`${point.targetDate}`+"'"+","+"'"+`${point.status}`+"'"+","+"'"+`${point.created_at}`+"'"+","+"'"+`${point.updated_at}`+"'"+","+"'"+`${tsk.id}`+"'"+");");

                        })
                      })
                    })
                })
              default:
          // code block
      }


  
};

let data = [];
// builder(data);
