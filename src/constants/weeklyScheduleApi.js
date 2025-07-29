import api from './api';

const weeklyScheduleApi = {
  getCompanies: () => {
    return api.get('/company/getCompany');
  },
  
  updateSchedule: (data) => {
    // data should include: company_id, sales_man, day, action
    return api.post('/company/updateSchedule', data);
  }
};

export default weeklyScheduleApi;
