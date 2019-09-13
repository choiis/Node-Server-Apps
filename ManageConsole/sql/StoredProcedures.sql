
CREATE PROCEDURE calc_daily 
(
@num tinyint
)
AS
DECLARE @yesterday char(10) = convert(varchar(10),dateadd(d,-@num,GETDATE()),121)
DECLARE @from datetime = convert(datetime,@yesterday + ' 00:00:00')
DECLARE @to datetime = convert(datetime,@yesterday + ' 23:59:59')

merge into daily as D
    Using (select T.day,T.uniqueuser,S.dailytraffic from
		(select count(distinct userid) as uniqueuser,
		@yesterday as day
		 from cso_login
		where logindate between @from and @to) T,
		(select count(*) as dailytraffic from cso_chatting
	where logdate between @from and @to) S) as C
	ON (D.regdate= C.day)
    WHEN NOT MATCHED THEN
        INSERT (regdate,uniqueuser,chattraffic) VALUES (C.day,C.uniqueuser,C.dailytraffic)
    WHEN MATCHED THEN
        UPDATE SET uniqueuser = C.uniqueuser, chattraffic = C.dailytraffic;
GO