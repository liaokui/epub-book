import { getCaptcha, login } from './login.server.js'

export default {
  components: {},
  data() {
    return {
      codeHtml: null,
      loading: false,
      loginForm: {
        username: null,
        password: null,
        code: null,
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空!', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
        ]
      }
    };
  },
  created() {
    this.getCode()
  },
  methods: {
    getCode() { 
      getCaptcha().then(res => {
        if(res) {
          this.codeHtml = res
        }
      }, error => {
        this.$message.error(error)
      });
    },
    handleForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid){
          const params = {
            'username': this.loginForm.username,
            'password': this.loginForm.password,
            'code': this.loginForm.code,
          }
          this.loading = true;
          console.log(params);
          login(params).then(res => {
            this.loading = false
            if (res.code === 200) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              setTimeout(() => {
                this.$router.push({path: '/error'});
              }, 500);
            } else {
              this.$message({
                message: res.msg,
                type: 'warning'
              })
            }
          }, () => {
            this.$message({
              message: '请求失败!',
              type: 'error'
            })
            this.loading = false;
          });
        } else {
          return false;
        }
      });
    },
    init() {

    },
  },
  mounted() {
    this.$nextTick(function() {
      this.init();
    });
  },
};