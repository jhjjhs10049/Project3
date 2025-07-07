package org.zerock.mallapi.controller.formatter;

import org.springframework.format.Formatter;

import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class LocalDateFormatter implements Formatter<LocalDate> {

    @Override
    // 클라이언트가 보낸 "2025-07-07" 같은 문자열을 받아서 LocalDate 객체로 변환함
    // DateTimeFormatter.ofPattern("yyyy-MM-dd") 형식에 맞춰 파싱
    public LocalDate parse(String text, Locale locale) throws ParseException {
        return LocalDate.parse(text, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    }

    @Override
    // LocalDate 객체를 → "yyyy-MM-dd" 형식의 문자열로 바꿔줌
    public String print(LocalDate object, Locale locale) {
        return DateTimeFormatter.ofPattern("yyyy-MM-dd").format(object);
    }
}
