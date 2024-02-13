import { get, post } from '~/api/api';

export const useGoalsStore = defineStore('goals', {
    state: () => ({
      goals: [],
    }),
  
    actions: {
      async getUserGoals(page: any) {
        try {
  
          const { data, error } = await get(`/auth/goals?page=${page}`);
  
          if (error.value) {
              return error.value
          } else {
            return data.value.goals
          }
        } catch (error) {

        }
      },

      async getGoalDetails(id: any){
        try{
          const {data, error} = await get(`auth/goals/${id}`)

          if(error.value){
            return error.value
          }else{
            return data.value.goal
          }
        }catch(error){
          return error;
        }
      },

      async updateGoalDetails(bodyData: object){
        try{
          const { data, error } = await post(`auth/goals/update`, bodyData);
          if(error.value){
            return error.value;
          }else{
            return data.value
          }
        }catch (error){
          return error;
        }
      },

      async deleteGoal(id: number){
          try {
            const { data, error } = await post(`auth/goal/delete`, {
              goal: id
            })

            if(error.value){
              return error.value
            }else{
              return data.value
            }

          }catch (error){
            return error;
          }
      }
    },
  
  });