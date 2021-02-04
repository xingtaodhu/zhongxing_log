<template>
    <div id="form">
      <span style="margin-left:600px;font-size:25px;">基于时序的异常预测</span>
    <el-form ref="form" :model="form" label-width="80px" style="width:400px;margin:30px auto 0;">
    <el-form-item label="开始时间">
         <el-date-picker v-model="form.start_time" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
    </el-date-picker>
    </el-form-item>
     <el-form-item label="结束时间">
         <el-date-picker v-model="form.end_time" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
    </el-date-picker>
    </el-form-item>
    <el-form-item label="模块名称">
        <el-select v-model="form.module_name" placeholder="请选择模块">
        <el-option label="MDU" value="MDU"></el-option>
        <el-option label="AAA" value="AAA" disabled=true></el-option>
        <el-option label="AS" value="AS" disabled=true></el-option>
        <el-option label="CMS" value="CMS" disabled=true></el-option>
        <el-option label="CCS" value="CCS" disabled=true></el-option>
        <el-option label="GBSG" value="GBSG" disabled=true></el-option>
        <el-option label="VOD" value="VOD" disabled=true></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="日志文本">
        <el-input type="textarea" v-model="form.logs"></el-input>
    </el-form-item>
    <el-form-item label="interval">
        <el-input v-model="form.interval"></el-input>
    </el-form-item>
    <el-form-item label="is_train">
        <el-switch v-model="form.is_train"></el-switch>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="onSubmit">预测</el-button>
        <el-button>取消</el-button>
    </el-form-item>
    </el-form>
   <el-dialog title="异常" :visible.sync="dialogTableVisible">
  <el-table :data="gridData">
    <el-table-column property="date" label="预测时间" width="150"></el-table-column>
    <el-table-column property="name" label="错误类型编码" width="类型编码"></el-table-column>
    <el-table-column property="address" label="错误类型模板"></el-table-column>
  </el-table>
</el-dialog>
    </div> 
</template>

<script>
  export default {
    name:'Api',
    data() {
      return {
        gridData:[],
        dialogTableVisible: false,
        form: {
          start_time:'',
          end_time:'',
          module_name: '',
          logs:'',
          interval:'',
          is_train:true
        }
      }
    },
    methods: {
      onSubmit() {
        let formToPost = _.cloneDeep(this.form);
        const data = {
      is_train: false,
      start_time: "2020-03-09 14:11:59",
      logs: [
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:58,918 - DoHttpIndication: Can Not Handler CmdName = wa.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:58,934 - DoHttpIndication: Can Not Handler CmdName = wa.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:58,956 - DoHttpIndication: Can Not Handler CmdName = wa.exe",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:58,971 - DoHttpIndication: Can Not Handler CmdName = wa.exe",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:58,991 - DoHttpIndication: Can Not Handler CmdName = whois.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,000 - DoHttpIndication: Can Not Handler CmdName =",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,009 - DoHttpIndication: Can Not Handler CmdName = whois.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,020 - DoHttpIndication: Can Not Handler CmdName =",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,023 - DoHttpIndication: Can Not Handler CmdName = printenv",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,056 - DoHttpIndication: Can Not Handler CmdName = printenv",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,075 - DoHttpIndication: Can Not Handler CmdName = index.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,089 - DoHttpIndication: Can Not Handler CmdName = index.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,104 - DoHttpIndication: Can Not Handler CmdName = defaultwebpage.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,132 - DoHttpIndication: Can Not Handler CmdName = defaultwebpage.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,158 - DoHttpIndication: Can Not Handler CmdName = entropysearch.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,181 - DoHttpIndication: Can Not Handler CmdName = entropysearch.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,196 - DoHttpIndication: Can Not Handler CmdName = index.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,197 - DoHttpIndication: Can Not Handler CmdName =",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,210 - DoHttpIndication: Can Not Handler CmdName = index.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,222 - DoHttpIndication: Can Not Handler CmdName = index.pl",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,230 - DoHttpIndication: Can Not Handler CmdName = search",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,237 - DoHttpIndication: Can Not Handler CmdName = index.pl",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,265 - DoHttpIndication: Can Not Handler CmdName = index.sh",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,290 - DoHttpIndication: Can Not Handler CmdName = index.sh",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,302 - DoHttpIndication: Can Not Handler CmdName = nph-mr.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,316 - DoHttpIndication: Can Not Handler CmdName = nph-mr.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,330 - DoHttpIndication: Can Not Handler CmdName = query.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,346 - DoHttpIndication: Can Not Handler CmdName = query.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,368 - DoHttpIndication: Can Not Handler CmdName = session_login.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,382 - DoHttpIndication: Can Not Handler CmdName = session_login.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,396 - DoHttpIndication: Can Not Handler CmdName = show_bug.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,419 - DoHttpIndication: Can Not Handler CmdName =",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,420 - DoHttpIndication: Can Not Handler CmdName = show_bug.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,434 - DoHttpIndication: Can Not Handler CmdName = test",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,447 - DoHttpIndication: Can Not Handler CmdName = test",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,462 - DoHttpIndication: Can Not Handler CmdName = test.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,475 - DoHttpIndication: Can Not Handler CmdName = test.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,506 - DoHttpIndication: Can Not Handler CmdName = isSamInstalled.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,528 - DoHttpIndication: Can Not Handler CmdName = isSamInstalled.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,547 - DoHttpIndication: Can Not Handler CmdName = whois.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,564 - DoHttpIndication: Can Not Handler CmdName = whois.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,575 - DoHttpIndication: Can Not Handler CmdName = GizaNETest899825894.html",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,581 - DoHttpIndication: Can Not Handler CmdName = wp-login.php",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,595 - DoHttpIndication: Can Not Handler CmdName = contextList.jsp",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,599 - DoHttpIndication: Can Not Handler CmdName = wp-login.php",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,613 - DoHttpIndication: Can Not Handler CmdName = wwwadmin.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,627 - DoHttpIndication: Can Not Handler CmdName = wwwadmin.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,651 - DoHttpIndication: Can Not Handler CmdName = wwwboard.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,666 - DoHttpIndication: Can Not Handler CmdName = wwwboard.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,693 - DoHttpIndication: Can Not Handler CmdName = cgi.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,710 - DoHttpIndication: Can Not Handler CmdName = cgi.cgi",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,730 - DoHttpIndication: Can Not Handler CmdName = trace.axd",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,959 - DoHttpIndication: Can Not Handler CmdName =",
        "ERROR root 0x7f168fefe700 2020-03-09 14:17:59,978 - DoHttpIndication: Can Not Handler CmdName = shtml.exe",
        "ERROR root 0x7f168fefe700 2020-03-09 14:18:00,103 - DoHttpIndication: Can Not Handler CmdName =",
        "ERROR root 0x7f168fefe700 2020-03-09 14:18:00,271 - DoHttpIndication: Can Not Handler CmdName =",
        "ERROR root 0x7f168fefe700 2020-03-09 14:18:00,466 - DoHttpIndication: Can Not Handler CmdName =",
        "ERROR root 0x7f168fefe700 2020-03-09 14:18:00,479 - DoHttpIndication: Can Not Handler CmdName =",
        "ERROR root 0x7f168fefe700 2020-03-09 14:18:00,482 - DoHttpIndication: Can Not Handler CmdName = default.asp%2e",
        "ERROR root 0x7f168fefe700 2020-03-09 14:18:00,496 - DoHttpIndication: Can Not Handler CmdName = error_page.htm",
        "ERROR root 0x7f168fefe700 2020-03-09 14:18:00,570 - DoHttpIndication: Can Not Handler CmdName = SiteScope",
        "ERROR root 0x7f168fefe700 2020-03-09 14:18:00,599 - DoHttpIndication: Can Not Handler CmdName =",
        "ERROR root 0x7f168fefe700 2020-03-09 14:18:00,641 - DoHttpIndication: Can Not Handler CmdName = ..",
        "ERROR root 0x7f168fefe700 2020-03-09 14:18:00,656 - DoHttpIndication: Can Not Handler CmdName =",
        "ERROR root 0x7f168fefe700 2020-03-09 14:18:00,712 - DoHttpIndication: Can Not Handler CmdName =",
        "ERROR root 0x7f168fefe700 2020-03-09 14:18:00,727 - DoHttpIndication: Can Not Handler CmdName = webconsole.html",
        "ERROR root 0x7f168fefe700 2020-03-09 14:18:03,074 - DoHttpIndication: Can Not Handler CmdName = SERVER.INI",
        "ERROR root 0x7f168fefe700 2020-03-09 14:18:03,717 - DoHttpIndication: Can Not Handler CmdName =",
        "ERROR root 0x7f168fefe700 2020-03-09 14:18:03,730 - DoHttpIndication: Can Not Handler CmdName = properties",
        "ERROR root 0x7f168fefe700 2020-03-09 14:18:04,136 - DoHttpIndication: Can Not Handler CmdName =",
        "ERROR root 0x7f168fefe700 2020-03-09 14:18:04,150 - DoHttpIndication: Can Not Handler CmdName = msadcs.dll",
        "ERROR root 0x7f168fefe700 2020-03-09 14:18:05,136 - DoHttpIndication: Can Not Handler CmdName =",
        "ERROR root 0x7f168fefe700 2020-03-09 14:18:05,151 - DoHttpIndication: Can Not Handler CmdName = index.html",
      ],
      end_time: "2020-03-09 14:18:08",
      module_name: "MDU",
      interval: 300,
    };
         formToPost.interval = parseInt(formToPost.interval)
        formToPost.logs = data.logs
        console.log(formToPost)
        console.log(data)
        this.$axios.post("http://10.141.208.77:5634/test_raw",data)
        .then(res=>{
            
            res.data.errors.forEach(element => {
              let obj = {}
              obj.date = element[0]
              obj.name = element[1]
              obj.address = element[2]
              this.gridData.push(obj)
            });

            
        })
        
        this.dialogTableVisible = true
      }
    }
  }
</script>

<style scoped>
</style>