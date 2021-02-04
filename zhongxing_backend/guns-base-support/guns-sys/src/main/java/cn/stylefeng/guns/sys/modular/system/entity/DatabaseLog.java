package cn.stylefeng.guns.sys.modular.system.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;

/**
 * Created by hufangzhou on 2020/1/7.
 */
@Data
@TableName("info_car")
public class DatabaseLog implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "ID", type = IdType.ID_WORKER)
    private String ID;

    /**
     * 车牌号码
     */
    @TableField("MODULE")
    private String MODULE;

    /**
     * 汽车容量
     */
    @TableField("SERVER_ID")
    private String SERVER_ID;

    /**
     * 汽车状态
     */
    @TableField("SERVICE_ID")
    private String SERVICE_ID;

    /**
     * 汽车类型
     */
    @TableField("CREATE_DATE")
    private String CREATE_DATE;

    @TableField("CPU_PERCENT")
    private String CPU_PERCENT;

    @TableField("ALARM_AMOUNT")
    private String ALARM_AMOUNT;

    @TableField("MEMORY_USED")
    private String MEMORY_USED;

    @TableField("MEMORY_TOTAL")
    private String MEMORY_TOTAL;

    @TableField("RUNNING_TIME")
    private String RUNNING_TIME;

    public String getID() {
        return ID;
    }

    public void setID(String ID) {
        this.ID = ID;
    }

    public String getMODULE() {
        return MODULE;
    }

    public void setMODULE(String MODULE) {
        this.MODULE = MODULE;
    }

    public String getSERVER_ID() {
        return SERVER_ID;
    }

    public void setSERVER_ID(String SERVER_ID) {
        this.SERVER_ID = SERVER_ID;
    }

    public String getSERVICE_ID() {
        return SERVICE_ID;
    }

    public void setSERVICE_ID(String SERVICE_ID) {
        this.SERVICE_ID = SERVICE_ID;
    }

    public String getCREATE_DATE() {
        return CREATE_DATE;
    }

    public void setCREATE_DATE(String CREATE_DATE) {
        this.CREATE_DATE = CREATE_DATE;
    }

    public String getCPU_PERCENT() {
        return CPU_PERCENT;
    }

    public void setCPU_PERCENT(String CPU_PERCENT) {
        this.CPU_PERCENT = CPU_PERCENT;
    }

    public String getALARM_AMOUNT() {
        return ALARM_AMOUNT;
    }

    public void setALARM_AMOUNT(String ALARM_AMOUNT) {
        this.ALARM_AMOUNT = ALARM_AMOUNT;
    }

    public String getMEMORY_USED() {
        return MEMORY_USED;
    }

    public void setMEMORY_USED(String MEMORY_USED) {
        this.MEMORY_USED = MEMORY_USED;
    }

    public String getMEMORY_TOTAL() {
        return MEMORY_TOTAL;
    }

    public void setMEMORY_TOTAL(String MEMORY_TOTAL) {
        this.MEMORY_TOTAL = MEMORY_TOTAL;
    }

    public String getRUNNING_TIME() {
        return RUNNING_TIME;
    }

    public void setRUNNING_TIME(String RUNNING_TIME) {
        this.RUNNING_TIME = RUNNING_TIME;
    }

    public String getPERIOD() {
        return PERIOD;
    }

    public void setPERIOD(String PERIOD) {
        this.PERIOD = PERIOD;
    }

    public String getON_LINE() {
        return ON_LINE;
    }

    public void setON_LINE(String ON_LINE) {
        this.ON_LINE = ON_LINE;
    }

    @TableField("PERIOD")
    private String PERIOD;

    @TableField("ON_LINE")
    private String ON_LINE;


    public static long getSerialVersionUID() {
        return serialVersionUID;
    }


}
