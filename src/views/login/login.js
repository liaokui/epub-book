import { getCaptcha, login } from './login.server.js'
import { setToken, setUsername, setUid } from '../../utils/auth.js'

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
          login(params).then(res => {
            this.loading = false
            if (res && res.status === 'success') {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              setToken(res.token)
              setUsername(res.data.username)
              setUid(res.data.uid)
              setTimeout(() => {
                this.$router.push({path: '/list'});
              }, 500);
            } else {
              this.$message({
                message: res.msg,
                type: 'warning'
              })
              this.getCode()
            }
          }, () => {
            this.$message({
              message: '请求失败!',
              type: 'error'
            })
            this.loading = false;
            this.getCode()
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