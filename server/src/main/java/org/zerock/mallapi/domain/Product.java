package org.zerock.mallapi.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tbl_product")
@Getter
@ToString(exclude = "imageList")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pno;

    private String pname;
    private int price;
    private String pdesc;
    private boolean delFlag;

    //@ElementCollection?
    //기본적으로 lazy_loading 방식으로 동작한다.
    //DB 에는 컬렉션 타입이 없다.
    //@ElementCollection 은 값타입(EmbededAble 또는 기본형)을 담고 있는 컬렉션을 매핑할때 사용
    //엔티티에 포함된 컬렉션 값 타입(예: List<String>, Set<Integer>)을 DB에
    //별도의 테이블로 저장할 때 사용합니다.
    //@ElementCollection과 같이 하나의 엔티티가 여러 개의 객체를 추가적으로 담고 있을때는
    //자동으로 이에 해당하는 테이블이 생성되고 외래키(FK)가 생성된다.
    //예제에서는 product_image_list 라는 이름으로 테이블이 생성된다.
    @ElementCollection
    @Builder.Default
    private List<ProductImage> imageList = new ArrayList<>();

    public void changePrice(int price){
        this.price = price;
    }

    public void changeDesc(String desc){
        this.pdesc = desc;
    }

    public void changeName(String name){
        this.pname = name;
    }

    public void addImage(ProductImage image){
        //imageList 의 초기값 크기는 0 이다
        //그래서 첫번째 입력되는 이미지의 Ord 는 0 이 된다.
        //첫번째 이미지가 저장 되었다면 imageList 의 크기는 1 이다.
        //그래서 두번재 입력되는 이미지의 Ord 는 1 이 된다.
        image.setOrd(this.imageList.size());
        imageList.add(image);
    }

    public void addImageString(String fileName){
        ProductImage productImage = ProductImage.builder()
                .fileName(fileName)
                .build();

        addImage(productImage);
    }

    public void clearList(){
        this.imageList.clear();;
    }

}
