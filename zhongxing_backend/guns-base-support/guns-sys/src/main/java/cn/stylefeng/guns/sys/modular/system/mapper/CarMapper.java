package cn.stylefeng.guns.sys.modular.system.mapper;

import cn.stylefeng.guns.sys.modular.system.entity.Car;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * Created by hufangzhou on 2020/1/7.
 */
public interface CarMapper extends BaseMapper<Car> {

    /**
     * 查询车辆信息
     * */

    List<Map<String,Object>> getCars(@Param("page") Page page);

    void saveCar(Car car);
}
