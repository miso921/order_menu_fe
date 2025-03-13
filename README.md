# 리액트

## 기본 훅
<span style="font-size: 1.3rem">1. useState - 상태(state) 관리</span>
   - 컴포넌트 내부에서 상태를 관리할 때 사용한다.

``` 
import { useState } from "react";

const Counter = () => {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>현재 카운트: {count}</p>
            <button onClick={()=> setCount(count + 1)}>+</button>
            <button onClick={()=> setCount(count - 1)}>-</button>
        </div>
    );
};
```

* * *
<span style="font-size: 1.3rem">2. useEffect - side effects 처리</span>
- 컴포넌트가 렌더링될 때 실행할 코드를 정의할 때 사용합니다.
- 두 번째 매개변수, 의존성 배열에 특정 값이 비어있으면 처음 마운트 될 떄만 실행되고 배열에 값을 넣으면 그 값이 변경될 때마다 실행됩니다.

```
import { useState, useEffect } from "react";

const App = () => {
    useEffect(()=> {
        console.log("최초 마운트");
    }, []) // 의존성 배열에 값을 비워두면 최초 마운트될 때만 실행
}
```
```
import { useState, useEffect } from "react";

const App = () => {
    const [count, setCount] = useState(0);
    
    useEffect(()=> {
        console.log(`count가 변경됨: ${count}`);    
    }, [count]); // count 값이 바뀔 때만 실행됨
    
    return (
        <div>
            <h1>{count}</h1>
            <button onClick={()=> setCount(count + 1)}>+1 증가</button>
        </div>
    );
};

export default App;
```

* * *

## 라이브러리
<span style="font-size: 1.3rem">1. useForm - 폼 관리를 간편하게 하기 위한 훅</span>
- 외부 라이브러리에서 제공하는 훅으로 패키지를 설치해야 합니다.
```
npm install react-hook-form
```

```
import React from "react";
import { useForm } from "react-hook-form";

const MyForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("name", { required: "Name is required" })}
        placeholder="Name"
      />
      {errors.name && <p>{errors.name.message}</p>}

      <input
        {...register("email", { 
          required: "Email is required", 
          pattern: {
            value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
            message: "Invalid email"
          }
        })}
        placeholder="Email"
      />
      {errors.email && <p>{errors.email.message}</p>}

      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
```
---
- register: 폼의 각 입력 필드를 useForm에 등록합니다.
   * 첫 번째 인자는 이름(name)입니다.
   * 두 번째 인자는 유효성 검사 규칙입니다.
```
<input {...register("fieldName", { required: true, maxLength: 10 })} />
```

---
- handleSubmit: 제출 이벤트를 처리합니다. onSubmit 콜백은 폼이 유효하면 호출됩니다.
```
const onSubmit = (data) => {
  console.log(data); // data는 제출된 폼의 데이터 객체
};
```

---
- errors: 유효성 검사에서 발생한 오류를 추적합니다.
```
{errors.fieldName && <span>{errors.fieldName.message}</span>}
```
이 외에도 isValid, dirtyFields, isDirty, reset 등 다양한 기능이 있습니다.

https://react-hook-form.com/

---
<span style="font-size: 1.3rem">2. useSWR - 폼 관리를 간편하게 하기 위한 훅</span>
- 데이터 fetching을 쉽게 관리하기 위한 훅
- 주로 데이터 비동기 처리 및 리프레시와 관련된 문제를 처리

```
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then(res => res.json());

function MyComponent() {
  const { data, error } = useSWR('/api/data', fetcher);

  if (error) return <div>에러 발생!</div>;
  if (!data) return <div>로딩 중...</div>;

  return <div>데이터: {JSON.stringify(data)}</div>;
}
```
- 첫 번쨰 인자는 key, key는 데이터를 식별하는 값으로 URL 또는 key 값일 수 있습니다.
- 두 번째 인자는 fetcher 함수입니다. 서버로 데이터를 요청하는 방법을 정의하는 곳으로 보통 fetch()나 axios()를 사용해 데이터를 받아옴
- data는 가져온 데이터를 의미합니다.
- error는 데이터 fetching 중 발생한 오류

---
### 이 외에 SWR에서 제공하는 상태들
- mutate: 수동으로 데이터를 갱신할 수 있는 함수
    * 특정 데이터를 업데이트하거나 캐시된 데이터를 직접 변경할 때 사용됩니다.
```
import useSWR, { mutate } from 'swr';

const fetcher = (url) => fetch(url).then(res => res.json());

function MyComponent() {
  const { data, error } = useSWR('/api/data', fetcher);

  const refreshData = async () => {
    mutate('/api/data');  // '/api/data'를 직접 갱신
  };

  if (error) return <div>에러 발생!</div>;
  if (!data) return <div>로딩 중...</div>;

  return (
    <div>
      <div>데이터: {JSON.stringify(data)}</div>
      <button onClick={refreshData}>새로 고침</button>
    </div>
  );
}

```
이 외에도 등 다양한 상태 기능과 옵션이 있습니다.

https://swr.vercel.app/ko/docs/getting-started