<template>
  <div>
    <b-alert v-if="employee.createdBy != userId" show variant="info"
      >Read-only. You are not the owner of this record.</b-alert
    >
    <employee-form
      :key="employee.employee_id"
      v-model="employee"
      @save="save"
    ></employee-form>
  </div>
</template>
<script>
import EmployeeForm from '~/components/employee/forms/EmployeeForm';
export default {
  components: {
    EmployeeForm
  },
  data() {
    return {
      feedbacks: [],
      employee: {}
    };
  },
  validate({ params }) {
    const id = params.id;

    return /\d{1,5}/.test(id);
  },
  async mounted() {
    await this.load(this.$route.params.id);
  },
  methods: {
    async load(employeeId) {
      const query = `query { employees(where: {employee_id: {_eq: ${employeeId}}}) { address birth_date city country employee_id first_name hire_date home_phone last_name notes postal_code region reports_to title title_of_courtesy reports_to_employee { employee_id first_name last_name } createdBy } }`;

      const employee = this.$_.get(
        await this.$hasura(query),
        'data.employees[0]',
        {}
      );
      const { reports_to_employee } = employee;

      this.employee = {
        ...employee,
        reports_to_employee: {
          ...reports_to_employee,
          name:
            reports_to_employee.first_name + ' ' + reports_to_employee.last_name
        }
      };
    },
    async save(employee) {
      await this.$store.dispatch('employee/save', this.employee);
      this.$router.push('/employees');
    }
  }
};
</script>
