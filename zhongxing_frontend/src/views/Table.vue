<template>
  <div style="margin-left:20px;margin-top:20px;">
    <div>
      筛选：
      <el-select v-model="filterModule" placeholder="请选择模块">
            <el-option label="AAA" value="AAA"></el-option>
            <el-option label="CMS" value="CMS"></el-option>
            <el-option label="CCS" value="CCS"></el-option>
            <el-option label="SA" value="SA"></el-option>
            <el-option label="VOD" value="VOD"></el-option>
            <el-option label="MDU" value="MDU"></el-option>
            <el-option label="PORTAL" value="PORTAL"></el-option>
      </el-select>
      <el-button @click="filterModuleFunc()" type="primary">应用筛选</el-button>
      <el-button
        @click="clearFilterModuleFunc()"
        type="primary"
        :disabled="clearFilterDisabled"
      >取消筛选</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="date" label="日期" width="120"></el-table-column>
      <el-table-column prop="module_name" label="模块" width="120"></el-table-column>
      <el-table-column prop="template" label="日志模板" show-overflow-tooltip></el-table-column>
      <el-table-column prop="used" label="状态" width="300">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row['used']"
            active-text="已添加"
            inactive-text="未添加"
            @change="switch_used(scope.$index)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="编辑" width="120">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="toggleSelection(tableData)">选择全部</el-button>
      <el-button @click="toggleSelection()">取消选择</el-button>
      <el-button @click="addSelection()" type="primary" :disabled="addModuleDisabled">添加模板</el-button>
    </div>
    <div style="margin-top: 20px">
      <el-button type="primary" @click="dialogAddFormVisible = true">手动添加模板</el-button>
    </div>
    <el-dialog title="手动添加模板" :visible.sync="dialogAddFormVisible">
      <el-form :model="addForm">
        <el-form-item label="模块" :label-width="formLabelWidth">
          <el-select v-model="addForm.module_name" placeholder="请选择模块">
            <el-option label="AAA" value="AAA"></el-option>
            <el-option label="CMS" value="CMS"></el-option>
            <el-option label="CCS" value="CCS"></el-option>
            <el-option label="SA" value="SA"></el-option>
            <el-option label="VOD" value="VOD"></el-option>
            <el-option label="MDU" value="MDU"></el-option>
            <el-option label="PORTAL" value="PORTAL"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="addForm.date"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item> -->
        <el-form-item label="日志模板" :label-width="formLabelWidth">
          <el-input v-model="addForm.template" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="添加状态" :label-width="formLabelWidth">
          <el-switch v-model="addForm.used" active-text="已添加" inactive-text="未添加"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRecord()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改模板" :visible.sync="dialogEditFormVisible">
      <el-form :model="editForm">
        <el-form-item label="模块" :label-width="formLabelWidth">
          <el-select v-model="editForm.module_name" placeholder="请选择模块">
            <el-option label="AAA" value="AAA"></el-option>
            <el-option label="CMS" value="CMS"></el-option>
            <el-option label="CCS" value="CCS"></el-option>
            <el-option label="SA" value="SA"></el-option>
            <el-option label="VOD" value="VOD"></el-option>
            <el-option label="MDU" value="MDU"></el-option>
            <el-option label="PORTAL" value="PORTAL"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="editForm.date"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item> -->
        <el-form-item label="日志模板" :label-width="formLabelWidth">
          <el-input v-model="editForm.template" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="添加状态" :label-width="formLabelWidth">
          <el-switch v-model="editForm.used" active-text="已添加" inactive-text="未添加"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogEditFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
let table_json = [
  // {
  //   date: "2016-05-03",
  //   module_name: "CMS",
  //   template:
  //     "##################ERROR DUMP########################",
  //   used: true
  // },
  // {
  //   date: "2016-05-02",
  //   module_name: "CMS",
  //   template: "Request URI:",
  //   used: true
  // },
  // {
  //   date: "2016-05-04",
  //   module_name: "CMS",
  //   template: "Context Path:",
  //   used: true
  // },
  // {
  //   date: "2016-05-01",
  //   module_name: "CMS",
  //   template: "Products Dump",
  //   used: false
  // },
  // {
  //   date: "2016-05-08",
  //   module_name: "CMS",
  //   template:
  //     "Request URL:",
  //   used: true
  // },
  // {
  //   date: "2016-05-06",
  //   module_name: "MDU",
  //   template: "DoHttpIndication: Can Not Handler",
  //   used: true
  // },
  // {
  //   date: "2016-05-06",
  //   module_name: "MDU",
  //   template: "wqewqe",
  //   used: true
  // },
  // {
  //   date: "2016-05-07",
  //   module_name: "SA",
  //   template: "Notify",
  //   used: false
  // },
  // {
  //   date: "2016-05-06",
  //   module_name: "AAA",
  //   template: "Digest Responses are not matched!",
  //   used: true
  // },
  // {
  //   date: "2016-05-07",
  //   module_name: "CCS",
  //   template: "InviteComponentInstanceLiveForPu",
  //   used: false
  // }
];
console.log(table_json);
export default {
  mounted() {
    this.$axios.post('http://10.141.208.77:5678/get/mod_template', {})
      .then(response => {
        let ret = response['data'];
        for (let i in ret) {
          ret[i]['used'] = (ret[i]['used'] == 1);
          ret[i]['date'] = ret[i]['date'].substr(0, 10);
        }
        console.log(ret);
        this.tableData = ret;
      })
  },
  data() {
    return {
      dialogAddFormVisible: false,
      dialogEditFormVisible: false,
      tableData: table_json,
      multipleSelection: [],
      addForm: {
        module_name: "",
        template: "",
        used: false
      },
      editForm: {
        module_name: "",
        template: "",
        used: false
      },
      formLabelWidth: "80px",
      filterModule: "",
      originTableData: [],
      clearFilterDisabled: true,
      addModuleDisabled: true
    };
  },

  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.addModuleDisabled = this.multipleSelection.length == 0;
    },
    handleEdit(row) {
      console.log("edit", row);
      this.editForm = row;
      this.dialogEditFormVisible = true;
    },
    switch_used(row_index) {
      console.log(this.tableData[row_index]);
      this.$axios.post('http://10.141.208.77:5678/update/mod_template', {
        "error_code": this.tableData[row_index]['error_code'],
        "module_name": this.tableData[row_index]['module_name'],
        "template_name": this.tableData[row_index]['template'],
        "regex": this.tableData[row_index]['regex'],
        "json_description": this.tableData[row_index]['json_description'],
        "is_used": Number(this.tableData[row_index]['used'])
      }).then(response => {
        console.log(response);
      });
    },
    switch_data_used(row_data) {
      this.$axios.post('http://10.141.208.77:5678/update/mod_template', {
        "error_code": row_data['error_code'],
        "module_name": row_data['module_name'],
        "template_name": row_data['template'],
        "regex": row_data['regex'],
        "json_description": row_data['json_description'],
        "is_used": Number(row_data['used'])
      }).then(response => {
        console.log(response);
      });
    },
    addSelection() {
      for (let row in this.multipleSelection) {
        this.multipleSelection[row].used = true;
        this.switch_data_used(this.multipleSelection[row]);
      }
      this.$refs.multipleTable.clearSelection();
    },
    addRecord() {
      this.tableData.push(this.addForm);
      this.$axios.post('http://10.141.208.77:5678/save/mod_template', {
        "module_name": this.addForm['module_name'],
        "template_name": this.addForm['template'],
        "regex": null,
        "json_description": null,
        "is_used": Number(this.addForm['used'])
      }).then(response => {
        console.log(response);
      });
      // this.$axios.post('http://10.141.208.77:5678/get/mod_template', {})
      // .then(response => {
      //   let ret = response['data'];
      //   for (let i in ret) {
      //     ret[i]['used'] = (ret[i]['used'] == 1);
      //     ret[i]['date'] = ret[i]['date'].substr(0, 10);
      //   }
      //   console.log(ret);
      //   this.tableData = ret;
      // })
      this.dialogAddFormVisible = false;
    },
    filterModuleFunc() {
      if (this.filterModule != "") {
        this.originTableData = this.tableData;
        this.$axios.post('http://10.141.208.77:5678/get/mod_template', {"module_name": this.filterModule})
          .then(response => {
            let ret = response['data'];
            for (let i in ret) {
              ret[i]['used'] = (ret[i]['used'] == 1);
              ret[i]['date'] = ret[i]['date'].substr(0, 10);
            }
            console.log(ret);
            this.tableData = ret;
          })
        this.clearFilterDisabled = false;
      }
    },
    clearFilterModuleFunc() {
      this.filterModule = "";
      this.$axios.post('http://10.141.208.77:5678/get/mod_template', {})
      .then(response => {
        let ret = response['data'];
        for (let i in ret) {
          ret[i]['used'] = (ret[i]['used'] == 1);
          ret[i]['date'] = ret[i]['date'].substr(0, 10);
        }
        console.log(ret);
        this.tableData = ret;
      })
      this.clearFilterDisabled = true;
    }
  }
};
</script>