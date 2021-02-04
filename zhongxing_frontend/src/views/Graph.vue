<template>
  <div style="margin-left:20px;margin-top:20px;">
    <link rel="stylesheet" href="../static/css/font-awesome.min.css" />
    <link rel="stylesheet" href="../static/css/neo4jd3test.min.css" />
    <el-row>
      <el-switch
        v-model="select_mode_val"
        active-text="关联模式"
        inactive-text="查看模式"
        @change="switch_change_select_mode()"
      ></el-switch>
      <el-row></el-row>
      <span class="demonstration">请选择时间范围：</span>
      <el-date-picker
        :time-arrow-control="true"
        v-model="time_range"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :disabled="!select_mode_val"
      ></el-date-picker>
      <el-button
        ref="search_rel_btn"
        type="primary"
        :disabled="!select_mode_val"
        @click="btn_search_relationship"
      >查找并保存模块间关联</el-button>
      <el-button type="primary" @click="btn_clear_relationship">清空关联</el-button>
      <el-button @click="btn_set_parameters">修改训练参数</el-button>
      <!-- <el-button ref='select_btn' @click="btn_change_select_mode()" type="primary">进入模块选择模式</el-button> -->
      <!-- </el-col> -->
    </el-row>
    <el-dialog title="训练参数" :visible.sync="setParametersVisible">
      <el-form :model="parameters">
        <el-form-item label="最小支持度" :label-width="formLabelWidth">
          <el-input v-model="parameters.support" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="最小置信度" :label-width="formLabelWidth">
          <el-input v-model="parameters.conf" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="最小关联元数" :label-width="formLabelWidth">
          <el-input v-model="parameters.min_item_num" autocomplete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="滑窗步长" :label-width="formLabelWidth">
          <el-input v-model="parameters.step" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="窗口大小" :label-width="formLabelWidth">
          <el-input v-model="parameters.window" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setParametersVisible = false">取 消</el-button>
        <el-button type="primary" @click="setParametersVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <div id="neo4jd3" style="height: 800px;"></div>
  </div>
</template>

<script>
// document.getElementById('neo4jd3').style.display = '';
function rel2DataRelationship(r) {
  return r;
}
function graphNode2DataNode(r) {
  return r;
}
var neo4jd3Instance;

let screen_height, screen_width;

function init() {
  const eleId = "neo4jd3";
  console.log(document.getElementById(eleId));
  document.getElementById(eleId).innerHTML = "";
  // @ts-ignore
  let temp_neo4jd3Instance = new Neo4jd3("#neo4jd3", {
    highlight: [],
    red_rel: [],
    icons: {
      客户: "user",
      person: "user",
      Person: "user",
      Relation: "yelp",
      基金: "money",
      项目: "database",
      Company: "university",
      People: "handshake-o",
      stock: "credit-card",
      User: "user",
      Business: "yelp",
      Industry: "database",
      Shareholder: "money",
      Module: "database"
    },
    images: {
      Contributor: "https://eisman.github.io/neo4jd3/img/twemoji/1f38f.svg",
      Project: "https://eisman.github.io/neo4jd3/img/twemoji/1f5c3.svg"
    },
    minCollision: 60,
    neo4jData: { results: [], errors: [] },
    nodeRadius: 30,
    onNodeDoubleClick: onNodeDoubleClicked,
    onRelationshipDoubleClick: onRelationshipDoubleClicked,
    zoomFit: false
  });
  screen_height = temp_neo4jd3Instance.get_screen_height();
  screen_width = temp_neo4jd3Instance.get_screen_width();
  console.log(screen_width, screen_height);
  return temp_neo4jd3Instance;
}

function onNodeDoubleClicked(node) {
  // console.log("double click on node: ", node);
}

function onRelationshipDoubleClicked(relationship) {
  console.log("double click on relationship: ", relationship);
}

function show_data(graph_data) {
  let temp;
  neo4jd3Instance = init();
  // (document.getElementById("select_id3") as HTMLSelectElement).disabled = false;
  temp = graph_data;
  // console.log("出现了！res");
  // console.log(res);
  const d3Data = {
    nodes: [],
    relationships: []
  };
  for (let i in temp.nodes) {
    d3Data.nodes.push(graphNode2DataNode(temp.nodes[i]));
  }

  let important_rel = [];
  for (let i in temp.relationships) {
    d3Data.relationships.push(rel2DataRelationship(temp.relationships[i]));

    if (temp.relationships[i].type == "Recommend") {
      important_rel.push(temp.relationships[i].id);
    }
  }
  // console.log("important_rel", important_rel);
  // console.info(d3Data);
  neo4jd3Instance.replaceWithD3Data(d3Data, [], important_rel);
}
let module_id_map = {
  AS: 1,
  CCS: 2,
  AAA: 3,
  MDU: 4,
  VOD: 5,
  GBSG: 6,
  SA: 7
};
let rel_id = 100;
var graph_data = {
  nodes: [
    {
      labels: ["Module"],
      id: 1,
      properties: {
        name: "AS"
      },
      showName: "AS"
    },
    {
      labels: ["Module"],
      id: 2,
      properties: {
        name: "CCS"
      },
      showName: "CCS"
    },
    {
      labels: ["Module"],
      id: 3,
      properties: {
        name: "AAA"
      },
      showName: "AAA"
    },
    {
      labels: ["Module"],
      id: 4,
      properties: {
        name: "MDU"
      },
      showName: "MDU"
    },
    {
      labels: ["Module"],
      id: 5,
      properties: {
        name: "VOD"
      },
      showName: "VOD"
    },
    {
      labels: ["Module"],
      id: 6,
      properties: {
        name: "GBSG"
      },
      showName: "GBSG"
    },
    {
      labels: ["Module"],
      id: 7,
      properties: {
        name: "SA"
      },
      showName: "SA"
    }
  ],
  relationships: [
    // {
    //   startNode: 1,
    //   endNode: 3,
    //   source: 1,
    //   target: 3,
    //   id: 101,
    //   type: "rel",
    //   properties: {},
    //   linknum: "1",
    //   showName: "544"
    // },
    // {
    //   startNode: 1,
    //   endNode: 2,
    //   source: 1,
    //   target: 2,
    //   id: 102,
    //   type: "rel",
    //   properties: {},
    //   linknum: "1",
    //   showName: "543"
    // },
    // {
    //   startNode: 4,
    //   endNode: 5,
    //   source: 4,
    //   target: 5,
    //   id: 103,
    //   type: "rel",
    //   properties: {},
    //   linknum: "1",
    //   showName: "70"
    // },
    // {
    //   startNode: 4,
    //   endNode: 7,
    //   source: 4,
    //   target: 7,
    //   id: 104,
    //   type: "rel",
    //   properties: {},
    //   linknum: "1",
    //   showName: "70"
    // },
    // {
    //   startNode: 4,
    //   endNode: 6,
    //   source: 4,
    //   target: 6,
    //   id: 105,
    //   type: "rel",
    //   properties: {},
    //   linknum: "1",
    //   showName: "70"
    // },
    // {
    //   startNode: 5,
    //   endNode: 3,
    //   source: 5,
    //   target: 3,
    //   id: 106,
    //   type: "rel",
    //   properties: {},
    //   linknum: "1",
    //   showName: "70"
    // },
    // {
    //   startNode: 5,
    //   endNode: 6,
    //   source: 5,
    //   target: 6,
    //   id: 107,
    //   type: "rel",
    //   properties: {},
    //   linknum: "1",
    //   showName: "70"
    // },
    // {
    //   startNode: 2,
    //   endNode: 3,
    //   source: 2,
    //   target: 3,
    //   id: 108,
    //   type: "rel",
    //   properties: {},
    //   linknum: "1",
    //   showName: "70"
    // },
    // {
    //   startNode: 2,
    //   endNode: 6,
    //   source: 2,
    //   target: 6,
    //   id: 109,
    //   type: "rel",
    //   properties: {},
    //   linknum: "1",
    //   showName: "70"
    // }
  ]
};
let select_mode = false;
let exist_relations = [];
export default {
  data() {
    return {
      time_range: [new Date(2018, 0, 1, 0, 0), new Date(2020, 11, 31, 23, 59)],
      select_mode_val: false,
      setParametersVisible: false,
      parameters: {
        support: 0.01,
        conf: 0.1,
        min_item_num: 2,
        step: 1,
        window: 2
      },
      formLabelWidth: "110px"
    };
  },
  mounted() {
    // console.log(graph_data);
    show_data(graph_data);
  },
  methods: {
    switch_change_select_mode() {
      console.log("change");
      select_mode = !select_mode;
      neo4jd3Instance.change_select_mode(select_mode);
    },
    btn_clear_relationship() {
      show_data(graph_data);
      exist_relations = [];
      this.select_mode_val = false;
      select_mode = false;
      neo4jd3Instance.change_select_mode(false);
    },
    btn_search_relationship() {
      let module2search = neo4jd3Instance.get_select_info();
      if (module2search.length == 0) {
        return;
      }
      console.log(module2search);
      console.log(this.time_range[0].getTime(), this.time_range[1].getTime());
      let new_relationships = [];
      let edge_count = 0;
      for (let i = 0; i < module2search.length; i++) {
        for (let j = i + 1; j < module2search.length; j++) {
          if (Math.random()>0.5) {
            continue;
          }
          let id_i = module_id_map[module2search[i]];
          let id_j = module_id_map[module2search[j]];
          if (exist_relations.indexOf(id_i + "#" + id_j) > -1) {
            console.log(id_i + "#" + id_j, "跳过");
            continue;
          }
          edge_count += 1;
          exist_relations.push(id_i + "#" + id_j);
          console.log(exist_relations);
          new_relationships.push({
            startNode: id_i,
            endNode: id_j,
            source: id_i,
            target: id_j,
            id: rel_id,
            type: "rel",
            properties: {},
            linknum: "1",
            showName: Math.round(Math.random() * 1000) / 1000
          });
          rel_id++;
        }
      }
      if (edge_count == 0) {
        this.$message('无边新增！');
      }
      neo4jd3Instance.updateWithD3Data({
        nodes: [],
        relationships: new_relationships
      });
      this.select_mode_val = false;
      select_mode = false;
      console.log("change");
      neo4jd3Instance.change_select_mode(false);
    },
    btn_set_parameters() {
      this.setParametersVisible = true;
    }
  }
};
</script>
